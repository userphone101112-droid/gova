/**
 * Delete Image Use Case
 * 
 * Use case for deleting images from storage and database.
 * This contains business logic for image deletion and coordinates between domain and infrastructure.
 */

import { ImageNotFoundError, ImageDeleteFailedError } from '@/domain';
import { IImageStorageProvider } from '../ports/image-storage.port';
import { IImageRepository } from '../ports/image-repository.port';

export class DeleteImageUseCase {
  constructor(
    private readonly storageProvider: IImageStorageProvider,
    private readonly imageRepository: IImageRepository
  ) {}

  async execute(imageId: string): Promise<void> {
    // Find image in database
    const image = await this.imageRepository.findById(imageId);
    if (!image) {
      throw new ImageNotFoundError(imageId);
    }

    // Delete from storage provider
    try {
      await this.storageProvider.delete(image.providerFileId);
    } catch (error) {
      throw new ImageDeleteFailedError(error instanceof Error ? error.message : 'Unknown error');
    }

    // Delete metadata from database
    const deleted = await this.imageRepository.delete(imageId);
    if (!deleted) {
      throw new ImageDeleteFailedError('Failed to delete image metadata from database');
    }
  }
}
