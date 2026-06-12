/**
 * Storage Adapter Interface
 * 
 * Defines the contract for storage providers.
 * Allows switching between different storage implementations (S3, Firebase Storage, etc.).
 */

export interface IStorageAdapter {
  /**
   * Upload a file
   */
  upload(file: File, path: string): Promise<{ url: string }>;

  /**
   * Download a file
   */
  download(path: string): Promise<Blob>;

  /**
   * Delete a file
   */
  delete(path: string): Promise<void>;

  /**
   * Get file metadata
   */
  getMetadata(path: string): Promise<{ size: number; contentType: string }>;

  /**
   * List files in a directory
   */
  listFiles(prefix: string): Promise<{ path: string }[]>;
}

/**
 * Firebase Storage Adapter
 * 
 * Implementation using Firebase Storage.
 */
export class FirebaseStorageAdapter implements IStorageAdapter {
  async upload(_file: File, _path: string): Promise<{ url: string }> {
    // Firebase implementation
    throw new Error('Not implemented');
  }

  async download(_path: string): Promise<Blob> {
    // Firebase implementation
    throw new Error('Not implemented');
  }

  async delete(_path: string): Promise<void> {
    // Firebase implementation
    throw new Error('Not implemented');
  }

  async getMetadata(_path: string): Promise<{ size: number; contentType: string }> {
    // Firebase implementation
    throw new Error('Not implemented');
  }

  async listFiles(_prefix: string): Promise<{ path: string }[]> {
    // Firebase implementation
    throw new Error('Not implemented');
  }
}

/**
 * S3 Storage Adapter
 * 
 * Implementation using AWS S3.
 */
export class S3StorageAdapter implements IStorageAdapter {
  async upload(_file: File, _path: string): Promise<{ url: string }> {
    // S3 implementation
    throw new Error('Not implemented');
  }

  async download(_path: string): Promise<Blob> {
    // S3 implementation
    throw new Error('Not implemented');
  }

  async delete(_path: string): Promise<void> {
    // S3 implementation
    throw new Error('Not implemented');
  }

  async getMetadata(_path: string): Promise<{ size: number; contentType: string }> {
    // S3 implementation
    throw new Error('Not implemented');
  }

  async listFiles(_prefix: string): Promise<{ path: string }[]> {
    // S3 implementation
    throw new Error('Not implemented');
  }
}
