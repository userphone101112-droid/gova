/**
 * Image Repository Port
 * 
 * Interface for image repository operations.
 * This is a port in the Hexagonal Architecture pattern.
 * The application layer depends on this interface, not the implementation.
 */

import { Image, ImageProvider, EntityType } from '@/domain';

export interface IImageRepository {
  /**
   * Find an image by ID
   * @param id - Image ID
   * @returns Image or null if not found
   */
  findById(id: string): Promise<Image | null>;

  /**
   * Find images by entity type and entity ID
   * @param entityType - Entity type (user, product, etc.)
   * @param entityId - Entity ID
   * @returns Array of images
   */
  findByEntity(entityType: EntityType, entityId: string): Promise<Image[]>;

  /**
   * Find an image by provider file ID
   * @param providerFileId - Provider-specific file ID
   * @param provider - Storage provider
   * @returns Image or null if not found
   */
  findByProviderFileId(providerFileId: string, provider: ImageProvider): Promise<Image | null>;

  /**
   * Create a new image record
   * @param image - Image entity
   * @returns Created image
   */
  create(image: Image): Promise<Image>;

  /**
   * Delete an image by ID
   * @param id - Image ID
   * @returns True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Delete images by entity type and entity ID
   * @param entityType - Entity type
   * @param entityId - Entity ID
   * @returns Number of deleted images
   */
  deleteByEntity(entityType: EntityType, entityId: string): Promise<number>;

  /**
   * List all images with optional pagination
   * @param limit - Maximum number of results
   * @param offset - Number of results to skip
   * @returns Array of images
   */
  list(limit: number, offset: number): Promise<Image[]>;

  /**
   * Count total number of images
   * @returns Total count
   */
  count(): Promise<number>;
}
