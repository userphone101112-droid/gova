/**
 * Image Domain Errors
 * 
 * Domain error classes for image-related operations.
 * These errors represent business rule violations.
 */

export class ImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageError';
    Object.setPrototypeOf(this, ImageError.prototype);
  }
}

export class ImageNotFoundError extends ImageError {
  constructor(imageId: string) {
    super(`Image with ID ${imageId} not found`);
    this.name = 'ImageNotFoundError';
    Object.setPrototypeOf(this, ImageNotFoundError.prototype);
  }
}

export class InvalidImageTypeError extends ImageError {
  constructor(mimeType: string) {
    super(`Invalid image type: ${mimeType}`);
    this.name = 'InvalidImageTypeError';
    Object.setPrototypeOf(this, InvalidImageTypeError.prototype);
  }
}

export class ImageSizeExceededError extends ImageError {
  constructor(size: number, maxSize: number) {
    super(`Image size ${size} bytes exceeds maximum allowed size ${maxSize} bytes`);
    this.name = 'ImageSizeExceededError';
    Object.setPrototypeOf(this, ImageSizeExceededError.prototype);
  }
}

export class ImageUploadFailedError extends ImageError {
  constructor(reason: string) {
    super(`Image upload failed: ${reason}`);
    this.name = 'ImageUploadFailedError';
    Object.setPrototypeOf(this, ImageUploadFailedError.prototype);
  }
}

export class ImageDeleteFailedError extends ImageError {
  constructor(reason: string) {
    super(`Image deletion failed: ${reason}`);
    this.name = 'ImageDeleteFailedError';
    Object.setPrototypeOf(this, ImageDeleteFailedError.prototype);
  }
}

export class InvalidStorageProviderError extends ImageError {
  constructor(provider: string) {
    super(`Invalid storage provider: ${provider}`);
    this.name = 'InvalidStorageProviderError';
    Object.setPrototypeOf(this, InvalidStorageProviderError.prototype);
  }
}
