/**
 * Image DTOs
 * 
 * Data Transfer Objects for image-related operations.
 * These are used to transfer data between layers.
 */

export interface UploadImageDTO {
  file: Buffer;
  fileName: string;
  mimeType: string;
  entityType: string;
  entityId: string;
}

export interface ImageResponseDTO {
  id: string;
  url: string;
  provider: string;
  providerFileId: string;
  entityType: string;
  entityId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

export interface ListImagesQueryDTO {
  limit?: number;
  offset?: number;
}

export interface ListImagesResponseDTO {
  images: ImageResponseDTO[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
