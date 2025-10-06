#!/usr/bin/env tsx
/* eslint-disable */

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

interface ExportInfo {
  name: string;
  filePath: string;
  line: number;
  column: number;
  kind: "function" | "class" | "variable" | "type" | "interface" | "enum" | "namespace";
  isDefault?: boolean;
  usages: UsageInfo[];
}

interface UsageInfo {
  filePath: string;
  line: number;
  isImport: boolean;
  isTypeOnly?: boolean;
  context?: string;
}

interface AnalyzerOptions {
  includeTests?: boolean;
  targetFile?: string;
  verbose?: boolean;
}

class UnusedExportsAnalyzer {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private exports = new Map<string, ExportInfo>();
  private options: AnalyzerOptions;

  constructor(configPath: string, options: AnalyzerOptions = {}) {
    this.options = options;

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    if (configFile.error) {
      throw new Error(`Error reading tsconfig: ${configFile.error.messageText}`);
    }

    const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));

    // Don't filter files - we need all files to find usages
    // The filtering happens in shouldAnalyzeFile() method
    this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    this.checker = this.program.getTypeChecker();

    // Validate target file exists if specified
    if (options.targetFile) {
      const normalizedTarget = path.resolve(options.targetFile);
      const found = this.program.getSourceFiles().some((sf) => path.resolve(sf.fileName) === normalizedTarget);

      if (!found) {
        throw new Error(`Target file not found in TypeScript project: ${options.targetFile}`);
      }
    }
  }

  analyze(): void {
    // First pass: collect all exports (only from target file if specified)
    for (const sourceFile of this.program.getSourceFiles()) {
      if (this.shouldAnalyzeFile(sourceFile)) {
        this.collectExports(sourceFile);
      }
    }

    // Second pass: find usages (search all files for usage of exports from target)
    for (const sourceFile of this.program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile && !sourceFile.fileName.includes("node_modules")) {
        this.findUsages(sourceFile);
      }
    }
  }

  private shouldAnalyzeFile(sourceFile: ts.SourceFile): boolean {
    if (sourceFile.isDeclarationFile) return false;
    if (sourceFile.fileName.includes("node_modules")) return false;
    if (!this.options.includeTests && this.isTestFile(sourceFile.fileName)) return false;
    if (this.options.targetFile) {
      const normalizedTarget = path.resolve(this.options.targetFile);
      const normalizedSource = path.resolve(sourceFile.fileName);
      return normalizedSource === normalizedTarget;
    }
    return true;
  }

  private isTestFile(fileName: string): boolean {
    return (
      fileName.includes(".test.") ||
      fileName.includes(".spec.") ||
      fileName.includes("/tests/") ||
      fileName.includes("/__tests__/")
    );
  }

  private collectExports(sourceFile: ts.SourceFile): void {
    const visit = (node: ts.Node) => {
      const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());

      // Export declarations
      if (ts.isFunctionDeclaration(node) && this.isExported(node)) {
        const name = node.name?.text;
        if (name) {
          this.addExport(name, sourceFile.fileName, "function", pos);
        }
      }

      // Class declarations
      if (ts.isClassDeclaration(node)) {
        const name = node.name?.text;
        if (name) {
          // Check if this class is exported (directly or as default/named export later)
          const isDirectlyExported = this.isExported(node);
          const isDefaultExported = this.willBeExportedAsDefault(sourceFile, name);
          const isNamedExported = this.willBeNamedExported(sourceFile, name);

          if (isDirectlyExported || isDefaultExported || isNamedExported) {
            // Add the class itself
            if (isDirectlyExported) {
              this.addExport(name, sourceFile.fileName, "class", pos);
            }

            // Collect class members
            this.collectClassMembers(node, sourceFile, name);
          }
        }
      }

      // Interface declarations
      if (ts.isInterfaceDeclaration(node) && this.isExported(node)) {
        const name = node.name?.text;
        if (name) {
          this.addExport(name, sourceFile.fileName, "interface", pos);
        }
      }

      // Type alias declarations
      if (ts.isTypeAliasDeclaration(node) && this.isExported(node)) {
        const name = node.name?.text;
        if (name) {
          this.addExport(name, sourceFile.fileName, "type", pos);
        }
      }

      // Variable statements
      if (ts.isVariableStatement(node) && this.isExported(node)) {
        node.declarationList.declarations.forEach((decl) => {
          if (ts.isIdentifier(decl.name)) {
            const kind = this.getVariableKind(decl);
            this.addExport(decl.name.text, sourceFile.fileName, kind, pos);
          }
        });
      }

      // Named exports
      if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          this.addExport(element.propertyName?.text || element.name.text, sourceFile.fileName, "variable", pos);
        });
      }

      // Default exports
      if (ts.isExportAssignment(node) && !node.isExportEquals) {
        this.addExport("default", sourceFile.fileName, "variable", pos, true);
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  private collectClassMembers(classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, className: string): void {
    classNode.members.forEach((member) => {
      if (member.name && ts.isIdentifier(member.name)) {
        const pos = sourceFile.getLineAndCharacterOfPosition(member.getStart());
        const visibility = this.getMemberVisibility(member);
        const memberName = `${className}.${member.name.text}`;

        // Include protected members with special prefix
        if (visibility === "protected") {
          const protectedName = `[protected] ${memberName}`;
          let kind: ExportInfo["kind"] = "function";
          if (ts.isPropertyDeclaration(member)) kind = "variable";
          this.addExport(protectedName, sourceFile.fileName, kind, pos);
        } else if (visibility === "public") {
          let kind: ExportInfo["kind"] = "function";
          if (ts.isPropertyDeclaration(member)) kind = "variable";
          this.addExport(memberName, sourceFile.fileName, kind, pos);
        }
      }
    });
  }

  private getMemberVisibility(member: ts.ClassElement): "public" | "protected" | "private" {
    const modifiers = ts.getCombinedModifierFlags(member as ts.Declaration);

    if (modifiers & ts.ModifierFlags.Private) {
      return "private";
    }
    if (modifiers & ts.ModifierFlags.Protected) {
      return "protected";
    }
    return "public";
  }

  private findUsages(sourceFile: ts.SourceFile): void {
    const visit = (node: ts.Node) => {
      // Import declarations
      if (ts.isImportDeclaration(node)) {
        this.processImportDeclaration(node, sourceFile);
      }

      // Property access (for class members) - process before recursing to handle nested access
      if (ts.isPropertyAccessExpression(node)) {
        this.processPropertyAccess(node, sourceFile);
        // Still recurse to handle nested property accesses
        ts.forEachChild(node, visit);
        return; // Don't process children again
      }

      // Identifier references
      if (ts.isIdentifier(node) && !ts.isPropertyAccessExpression(node.parent)) {
        this.processIdentifier(node, sourceFile);
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  private processImportDeclaration(node: ts.ImportDeclaration, sourceFile: ts.SourceFile): void {
    if (!node.importClause) return;

    const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const isTypeOnly = node.importClause.isTypeOnly || false;

    // Named imports
    if (node.importClause.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
      node.importClause.namedBindings.elements.forEach((element) => {
        const exportInfo = this.findExportByName(element.propertyName?.text || element.name.text);
        if (exportInfo) {
          exportInfo.usages.push({
            filePath: sourceFile.fileName,
            line: pos.line + 1,
            isImport: true,
            isTypeOnly: isTypeOnly || element.isTypeOnly
          });
        }
      });
    }

    // Default import
    if (node.importClause.name) {
      const exportInfo = this.findExportByName("default");
      if (exportInfo) {
        exportInfo.usages.push({
          filePath: sourceFile.fileName,
          line: pos.line + 1,
          isImport: true,
          isTypeOnly
        });
      }
    }
  }

  private processPropertyAccess(node: ts.PropertyAccessExpression, sourceFile: ts.SourceFile): void {
    const memberName = node.name.text;

    // Get the object name, handling nested property access like this.editorManager.method()
    let objectName = "";

    if (ts.isPropertyAccessExpression(node.expression)) {
      const innerExpr = node.expression as ts.PropertyAccessExpression;
      if (innerExpr.expression.kind === ts.SyntaxKind.ThisKeyword) {
        objectName = innerExpr.name.text; // e.g., "editorManager" from this.editorManager
      } else if (ts.isIdentifier(innerExpr.expression)) {
        objectName = innerExpr.expression.text; // Handle other nested patterns
      }
    } else if (ts.isIdentifier(node.expression)) {
      objectName = node.expression.text;
    }

    if (!objectName) return;

    // Try as Class.member first
    let fullName = `${objectName}.${memberName}`;
    let exportInfo = this.findExportByName(fullName);

    if (!exportInfo) {
      // Check for common instance variable patterns
      // Map instance names to their class types
      const instanceToClassMap: Record<string, string[]> = {
        orchestrator: ["Orchestrator"],
        editorManager: ["EditorManager"],
        timelineManager: ["TimelineManager"],
        store: ["OrchestratorStore"],
        manager: ["EditorManager", "TimelineManager"] // Could be either
      };

      // Try to find the class this instance belongs to
      const possibleClasses = instanceToClassMap[objectName] || ["Orchestrator", "EditorManager", "TimelineManager"];

      for (const className of possibleClasses) {
        fullName = `${className}.${memberName}`;
        exportInfo = this.findExportByName(fullName);

        if (!exportInfo) {
          // Also check for protected members
          const protectedName = `[protected] ${className}.${memberName}`;
          exportInfo = this.findExportByName(protectedName);
        }

        if (exportInfo) break;
      }
    }

    if (exportInfo) {
      const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      exportInfo.usages.push({
        filePath: sourceFile.fileName,
        line: pos.line + 1,
        isImport: false,
        context: this.getNodeContext(node)
      });
    }
  }

  private processIdentifier(node: ts.Identifier, sourceFile: ts.SourceFile): void {
    const exportInfo = this.findExportByName(node.text);
    if (exportInfo && exportInfo.filePath === sourceFile.fileName) {
      // Internal usage in the same file
      const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());

      // Avoid duplicate entries for the export declaration itself
      if (pos.line + 1 !== exportInfo.line) {
        exportInfo.usages.push({
          filePath: sourceFile.fileName,
          line: pos.line + 1,
          isImport: false,
          context: this.getNodeContext(node)
        });
      }
    }
  }

  private getNodeContext(node: ts.Node): string {
    // Get the parent statement for context
    let parent = node.parent;
    while (parent && !ts.isStatement(parent)) {
      parent = parent.parent;
    }

    if (parent) {
      const text = parent.getText();
      return text.length > 100 ? text.substring(0, 100) + "..." : text;
    }

    return "";
  }

  private findExportByName(name: string): ExportInfo | undefined {
    return this.exports.get(name);
  }

  private isExported(node: ts.Node): boolean {
    const modifiers = ts.getCombinedModifierFlags(node as ts.Declaration);
    return (modifiers & ts.ModifierFlags.Export) !== 0;
  }

  private willBeExportedAsDefault(sourceFile: ts.SourceFile, className: string): boolean {
    let found = false;
    const visit = (node: ts.Node) => {
      // Check for: export default ClassName
      if (ts.isExportAssignment(node) && !node.isExportEquals) {
        if (ts.isIdentifier(node.expression) && node.expression.text === className) {
          found = true;
        }
      }
      if (!found) ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return found;
  }

  private willBeNamedExported(sourceFile: ts.SourceFile, className: string): boolean {
    let found = false;
    const visit = (node: ts.Node) => {
      // Check for: export { ClassName } or export type { ClassName }
      if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          const exportName = element.propertyName?.text || element.name.text;
          if (exportName === className) {
            found = true;
          }
        });
      }
      if (!found) ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return found;
  }

  private getVariableKind(decl: ts.VariableDeclaration): ExportInfo["kind"] {
    if (decl.initializer) {
      if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) {
        return "function";
      }
      if (ts.isClassExpression(decl.initializer)) {
        return "class";
      }
    }
    return "variable";
  }

  private addExport(
    name: string,
    filePath: string,
    kind: ExportInfo["kind"],
    pos: ts.LineAndCharacter,
    isDefault = false
  ): void {
    this.exports.set(name, {
      name,
      filePath,
      line: pos.line + 1,
      column: pos.character + 1,
      kind,
      isDefault,
      usages: []
    });
  }

  getResults(): {
    completelyUnused: ExportInfo[];
    internalOnly: ExportInfo[];
    externallyUsed: ExportInfo[];
  } {
    const completelyUnused: ExportInfo[] = [];
    const internalOnly: ExportInfo[] = [];
    const externallyUsed: ExportInfo[] = [];

    for (const exportInfo of this.exports.values()) {
      const hasExternalUsage = exportInfo.usages.some((u) => u.isImport || u.filePath !== exportInfo.filePath);
      const hasInternalUsage = exportInfo.usages.some((u) => !u.isImport && u.filePath === exportInfo.filePath);

      if (exportInfo.usages.length === 0) {
        completelyUnused.push(exportInfo);
      } else if (!hasExternalUsage && hasInternalUsage) {
        internalOnly.push(exportInfo);
      } else {
        externallyUsed.push(exportInfo);
      }
    }

    // Sort by file path and line number for consistent output
    const sortFn = (a: ExportInfo, b: ExportInfo) => {
      const fileComp = a.filePath.localeCompare(b.filePath);
      return fileComp !== 0 ? fileComp : a.line - b.line;
    };

    return {
      completelyUnused: completelyUnused.sort(sortFn),
      internalOnly: internalOnly.sort(sortFn),
      externallyUsed: externallyUsed.sort(sortFn)
    };
  }

  printResults(): void {
    const results = this.getResults();
    const relativePath = (filePath: string) => path.relative(process.cwd(), filePath);

    console.log("\n🗑️  COMPLETELY UNUSED EXPORTS:");
    if (results.completelyUnused.length === 0) {
      console.log("  None found");
    } else {
      results.completelyUnused.forEach((exp) => {
        console.log(`  ${exp.kind} ${exp.name} at ${relativePath(exp.filePath)}:${exp.line}:${exp.column}`);
      });
    }

    console.log("\n⚠️  INTERNAL-ONLY EXPORTS (could be made private):");
    if (results.internalOnly.length === 0) {
      console.log("  None found");
    } else {
      results.internalOnly.forEach((exp) => {
        const internalUses = exp.usages.filter((u) => !u.isImport).length;
        console.log(
          `  ${exp.kind} ${exp.name} at ${relativePath(exp.filePath)}:${exp.line}:${exp.column} (${internalUses} internal uses)`
        );

        if (this.options.verbose && internalUses > 0) {
          exp.usages
            .filter((u) => !u.isImport)
            .forEach((usage) => {
              console.log(`    Used at line ${usage.line}`);
            });
        }
      });
    }

    console.log("\n✅ EXTERNALLY USED EXPORTS:");
    if (results.externallyUsed.length === 0) {
      console.log("  None found");
    } else {
      results.externallyUsed.forEach((exp) => {
        const externalUses = exp.usages.filter((u) => u.isImport || u.filePath !== exp.filePath).length;
        console.log(
          `  ${exp.kind} ${exp.name} at ${relativePath(exp.filePath)}:${exp.line}:${exp.column} (${externalUses} external uses)`
        );
      });
    }

    console.log(`\n📊 SUMMARY:`);
    console.log(`  Completely unused: ${results.completelyUnused.length}`);
    console.log(`  Internal-only: ${results.internalOnly.length}`);
    console.log(`  Externally used: ${results.externallyUsed.length}`);
    console.log(`  Total exports analyzed: ${this.exports.size}`);
  }

  generateMarkdownReport(): string {
    const results = this.getResults();
    const relativePath = (filePath: string) => path.relative(process.cwd(), filePath);

    let report = "# Export Analysis Report\n\n";

    report += `## Summary\n\n`;
    report += `- **Completely unused:** ${results.completelyUnused.length}\n`;
    report += `- **Internal-only:** ${results.internalOnly.length}\n`;
    report += `- **Externally used:** ${results.externallyUsed.length}\n`;
    report += `- **Total exports analyzed:** ${this.exports.size}\n\n`;

    if (results.completelyUnused.length > 0) {
      report += `## 🗑️ Completely Unused Exports\n\n`;
      report += `These exports are not referenced anywhere and can be safely deleted:\n\n`;

      results.completelyUnused.forEach((exp) => {
        report += `- [ ] \`${exp.kind}\` **${exp.name}** at \`${relativePath(exp.filePath)}:${exp.line}\`\n`;
      });
      report += "\n";
    }

    if (results.internalOnly.length > 0) {
      report += `## ⚠️ Internal-Only Exports\n\n`;
      report += `These are exported but only used within the same file. Consider making them private:\n\n`;

      results.internalOnly.forEach((exp) => {
        const uses = exp.usages.filter((u) => !u.isImport).length;
        report += `- [ ] \`${exp.kind}\` **${exp.name}** at \`${relativePath(exp.filePath)}:${exp.line}\` (${uses} internal uses)\n`;
      });
      report += "\n";
    }

    return report;
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const options: AnalyzerOptions = {
    includeTests: args.includes("--include-tests"),
    verbose: args.includes("--verbose") || args.includes("-v"),
    targetFile: undefined
  };

  // Find target file argument
  const targetIndex = args.findIndex((arg) => !arg.startsWith("--"));
  if (targetIndex >= 0) {
    options.targetFile = args[targetIndex];
  }

  const markdown = args.includes("--markdown") || args.includes("-m");

  try {
    const analyzer = new UnusedExportsAnalyzer("./tsconfig.json", options);

    if (options.targetFile) {
      console.log(`\n📝 Analyzing exports in: ${options.targetFile}\n`);
    }

    analyzer.analyze();

    if (markdown) {
      const report = analyzer.generateMarkdownReport();
      console.log(report);
    } else {
      analyzer.printResults();
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Show usage
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Usage: tsx scripts/analyze-exports.ts [options] [targetFile]

Options:
  --include-tests    Include test files in the analysis
  --verbose, -v      Show detailed usage information
  --markdown, -m     Generate markdown report
  --help, -h         Show this help message

Examples:
  # Analyze all exports
  tsx scripts/analyze-exports.ts

  # Analyze specific file
  tsx scripts/analyze-exports.ts components/complex-exercise/lib/Orchestrator.ts

  # Generate markdown report
  tsx scripts/analyze-exports.ts --markdown > unused-exports.md

  # Include test files
  tsx scripts/analyze-exports.ts --include-tests
`);
  process.exit(0);
}

main();
