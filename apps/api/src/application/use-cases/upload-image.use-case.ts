/**
 * Upload Image Use Case
 * 
 * Use case for uploading images to storage and saving metadata.
 * This contains business logic for image upload and coordinates between domain and infrastructure.
 */

import { Image, InvalidImageTypeError, ImageSizeExceededError } from '@/domain';
import { IImageStorageProvider } from '../ports/image-storage.port';
import { IImageRepository } from '../ports/image-repository.port';

export class UploadImageUseCase {
  constructor(
    private readonly storageProvider: IImageStorageProvider,
    private readonly imageRepository: IImageRepository
  ) {}

  async execute(params: {
    file: Buffer;
    fileName: string;
    mimeType: string;
    entityType: string;
    entityId: string;
    maxSizeMB?: number;
  }): Promise<Image> {
    const { file, fileName, mimeType, entityType, entityId, maxSizeMB = 10 } = params;

    // Validate file type
    const validMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!validMimeTypes.includes(mimeType)) {
      throw new InvalidImageTypeError(mimeType);
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.length > maxSizeBytes) {
      throw new ImageSizeExceededError(file.length, maxSizeBytes);
    }

    // Upload to storage provider
    const uploadResult = await this.storageProvider.upload(file, fileName, mimeType);

    // Create image entity
    const image = new Image(
      uploadResult.url,
      'cloudflare', // This will be determined by the storage provider in production
      uploadResult.providerFileId,
      entityType as any,
      entityId,
      uploadResult.mimeType,
      uploadResult.size,
      uploadResult.width,
      uploadResult.height
    );

    // Save metadata to database
    await this.imageRepository.create(image);

    return image;
  }
}
