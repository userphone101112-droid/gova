/**
 * Image Storage Port
 * 
 * Interface for image storage operations.
 * This is a port in the Hexagonal Architecture pattern.
 * The application layer depends on this interface, not the implementation.
 */

export interface ImageUploadResult {
  url: string;
  providerFileId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface ImageMetadata {
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface IImageStorageProvider {
  /**
   * Upload an image to the storage provider
   * @param file - File buffer or stream
   * @param fileName - Original file name
   * @param mimeType - File MIME type
   * @returns Upload result with URL and provider file ID
   */
  upload(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ImageUploadResult>;

  /**
   * Delete an image from the storage provider
   * @param fileId - Provider-specific file ID
   */
  delete(fileId: string): Promise<void>;

  /**
   * Get the public URL for an image
   * @param fileId - Provider-specific file ID
   * @returns Public URL
   */
  getPublicUrl(fileId: string): string;

  /**
   * Get metadata for an image
   * @param fileId - Provider-specific file ID
   * @returns Image metadata
   */
  getMetadata(fileId: string): Promise<ImageMetadata>;
}
