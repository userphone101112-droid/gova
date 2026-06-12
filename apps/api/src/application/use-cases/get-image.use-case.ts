/**
 * Get Image Use Case
 * 
 * Use case for retrieving a single image by ID.
 * This contains business logic for image retrieval.
 */

import { ImageNotFoundError } from '@/domain';
import { IImageRepository } from '../ports/image-repository.port';

export class GetImageUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(imageId: string) {
    const image = await this.imageRepository.findById(imageId);
    if (!image) {
      throw new ImageNotFoundError(imageId);
    }

    return image;
  }
}
