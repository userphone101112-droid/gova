/**
 * List Images Use Case
 * 
 * Use case for listing images with pagination.
 * This contains business logic for image listing.
 */

import { IImageRepository } from '../ports/image-repository.port';

export class ListImagesUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(params: { limit?: number; offset?: number }) {
    const { limit = 50, offset = 0 } = params;
    const images = await this.imageRepository.list(limit, offset);
    const total = await this.imageRepository.count();

    return {
      images,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }
}
