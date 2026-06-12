/**
 * Base Adapter Interface
 * 
 * Defines the contract for all adapters in the application.
 * Adapters provide a unified interface for different service implementations.
 */

export interface IAdapter<TConfig, TResult> {
  /**
   * Initialize the adapter with configuration
   */
  initialize(config: TConfig): Promise<void>;

  /**
   * Check if the adapter is ready
   */
  isReady(): boolean;

  /**
   * Get the adapter configuration
   */
  getConfig(): TConfig;

  /**
   * Perform the adapter's main operation
   */
  execute(input: unknown): Promise<TResult>;

  /**
   * Cleanup resources
   */
  cleanup(): Promise<void>;
}

/**
 * Base Adapter Implementation
 * 
 * Provides a default implementation of the adapter interface.
 * Can be extended by specific adapters for custom logic.
 */
export abstract class BaseAdapter<TConfig, TResult> implements IAdapter<TConfig, TResult> {
  protected config: TConfig | null = null;
  protected ready: boolean = false;

  abstract initialize(config: TConfig): Promise<void>;
  abstract execute(input: unknown): Promise<TResult>;

  isReady(): boolean {
    return this.ready;
  }

  getConfig(): TConfig {
    if (!this.config) {
      throw new Error('Adapter not initialized');
    }
    return this.config;
  }

  async cleanup(): Promise<void> {
    this.config = null;
    this.ready = false;
  }

  protected markReady(): void {
    this.ready = true;
  }
}
