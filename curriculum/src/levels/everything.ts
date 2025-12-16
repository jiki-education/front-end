import type { Level } from "./types";

export const everythingLevel: Level = {
  id: "everything",
  title: "Everything",
  description: "All language features enabled for testing and advanced exercises",
  educationalGoal: "Testing level with all features enabled",

  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "to_upper_case", "push", "sort_string"]
      }
    },
    javascript: {
      allowedNodes: [
        "LiteralExpression",
        "BinaryExpression",
        "UnaryExpression",
        "GroupingExpression",
        "IdentifierExpression",
        "AssignmentExpression",
        "UpdateExpression",
        "TemplateLiteralExpression",
        "ArrayExpression",
        "MemberExpression",
        "DictionaryExpression",
        "CallExpression",
        "ExpressionStatement",
        "VariableDeclaration",
        "BlockStatement",
        "IfStatement",
        "ForStatement",
        "ForOfStatement",
        "WhileStatement",
        "BreakStatement",
        "ContinueStatement"
      ],
      languageFeatures: {
        allowTruthiness: true,
        allowTypeCoercion: true,
        enforceStrictEquality: false,
        allowShadowing: true
      }
    },
    python: {
      allowedNodes: [
        "LiteralExpression",
        "BinaryExpression",
        "UnaryExpression",
        "GroupingExpression",
        "IdentifierExpression",
        "ListExpression",
        "SubscriptExpression",
        "CallExpression",
        "AttributeExpression",
        "ExpressionStatement",
        "PrintStatement",
        "AssignmentStatement",
        "BlockStatement",
        "IfStatement",
        "ForInStatement",
        "WhileStatement",
        "BreakStatement",
        "ContinueStatement",
        "FunctionDeclaration",
        "ReturnStatement"
      ],
      languageFeatures: {
        allowTruthiness: true,
        allowTypeCoercion: true
      }
    }
  }
};
