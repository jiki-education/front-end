/**
 * Manages keyboard shortcut scopes
 */
export class ScopeManager {
  private readonly scopes = new Set<string>(["global"]);

  /**
   * Push a new scope onto the stack
   * @param scope - Scope name to activate
   * @returns Function to remove the scope
   */
  push(scope: string): () => void {
    this.scopes.add(scope);
    return () => this.pop(scope);
  }

  /**
   * Remove a scope from the stack
   */
  private pop(scope: string): void {
    this.scopes.delete(scope);
  }

  /**
   * Check if a scope is currently active
   */
  isActive(scope: string): boolean {
    return this.scopes.has(scope);
  }

  /**
   * Get all active scopes
   */
  getActiveScopes(): Set<string> {
    return new Set(this.scopes);
  }

  /**
   * Clear all scopes except global
   */
  clear(): void {
    this.scopes.clear();
    this.scopes.add("global");
  }
}
