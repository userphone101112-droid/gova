# Image System

## Overview

The image system handles image upload, storage, retrieval, and management. It integrates with storage providers (Cloudflare R2, Google Drive) and maintains metadata in the database for efficient querying and association with entities.

## Architecture

### Image Flow

```
Upload → Validation → Storage → Metadata → Response
  ↓         ↓           ↓          ↓          ↓
Client   Business   Provider  Database   Client
         Rules
```

### Components

1. **Validation Layer**: File type and size validation
2. **Storage Layer**: Provider abstraction and upload
3. **Metadata Layer**: Database storage of image metadata
4. **Association Layer**: Entity-image relationships

## Image Entity

### Properties

**Location**: `packages/domain/entities.ts`

**Properties**:
- `id`: string (UUID)
- `url`: string (public URL)
- `provider`: ImageProvider ('cloudflare' | 'google_drive' | 's3' | 'minio')
- `providerFileId`: string (provider-specific identifier)
- `entityType`: EntityType ('user' | 'product' | 'post' | 'other' | 'merchant')
- `entityId`: string (associated entity ID)
- `mimeType`: string (image MIME type)
- `size`: number (file size in bytes)
- `width`: number | undefined (image width in pixels)
- `height`: number | undefined (image height in pixels)
- `createdAt`: Date (upload timestamp)

### Methods

- `isAssociatedWith(entityType: EntityType, entityId: string): boolean` - Check association
- `isValidMimeType(): boolean` - Validate MIME type
- `isValidSize(maxSizeMB: number): boolean` - Validate file size
- `toJSON(): object` - Serialize to JSON
- `static fromJSON(json: object): Image` - Deserialize from JSON

### Business Rules

- MIME type must be valid (jpeg, png, webp, gif, svg+xml)
- File size must not exceed max size (default 10MB)
- Image must be associated with an entity
- Provider must be supported

## Database Schema

### Images Table

**Location**: `apps/api/src/infrastructure/database/schema/image.schema.ts`

**Fields**:
- `id`: text (primary key)
- `url`: text (not null)
- `provider`: text (not null)
- `provider_file_id`: text (not null)
- `entity_type`: text (not null)
- `entity_id`: text (not null)
- `mime_type`: text (not null)
- `size`: integer (not null)
- `width`: integer (optional)
- `height`: integer (optional)
- `created_at`: integer (timestamp, not null)

**Indexes**:
- Primary key on `id`
- Composite index on `entity_type` and `entity_id`

**Relationships**:
- Many-to-one with `users` (via `entity_id` when `entity_type = 'user'`)

## Use Cases

### UploadImageUseCase

**Location**: `apps/api/src/application/use-cases/upload-image.use-case.ts`

**Purpose**: Upload image to storage and save metadata

**Input**:
- `file`: Buffer
- `fileName`: string
- `mimeType`: string
- `entityType`: string
- `entityId`: string
- `maxSizeMB`: number (default: 10)

**Output**: `Image` entity

**Validation**:
- MIME type: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
- File size: <= maxSizeMB

**Process**:
1. Validate MIME type
2. Validate file size
3. Upload to storage provider
4. Create Image entity
5. Save metadata to database
6. Return Image entity

---

### DeleteImageUseCase

**Location**: `apps/api/src/application/use-cases/delete-image.use-case.ts`

**Purpose**: Delete image from storage and database

**Input**: `id` (string)

**Output**: void

**Process**:
1. Find image by ID
2. Delete from storage provider
3. Delete metadata from database

---

### GetImageUseCase

**Location**: `apps/api/src/application/use-cases/get-image.use-case.ts`

**Purpose**: Retrieve image by ID

**Input**: `id` (string)

**Output**: `Image` entity

**Process**:
1. Find image by ID
2. Return Image entity

---

### ListImagesUseCase

**Location**: `apps/api/src/application/use-cases/list-images.use-case.ts`

**Purpose**: List images with pagination

**Input**:
- `limit`: number (optional)
- `offset`: number (optional)

**Output**:
- `images`: Image[]
- `total`: number
- `limit`: number
- `offset`: number
- `hasMore`: boolean

**Process**:
1. Query images with pagination
2. Calculate hasMore flag
3. Return paginated result

## API Endpoints

### Upload Image

**Endpoint**: `POST /images/upload`

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: File
  - `fileName`: string
  - `mimeType`: string
  - `entityType`: string
  - `entityId`: string

**Response**: `ImageResponseDTO`

**Status Codes**:
- 201: Created
- 400: Bad Request (validation error)
- 500: Internal Server Error

---

### Get Image

**Endpoint**: `GET /images/:id`

**Request**:
- Method: GET
- Params:
  - `id`: string

**Response**: `ImageResponseDTO`

**Status Codes**:
- 200: OK
- 404: Not Found

---

### List Images

**Endpoint**: `GET /images`

**Request**:
- Method: GET
- Query:
  - `limit`: number (optional)
  - `offset`: number (optional)

**Response**: `ListImagesResponseDTO`

**Status Codes**:
- 200: OK

---

### Delete Image

**Endpoint**: `DELETE /images/:id`

**Request**:
- Method: DELETE
- Params:
  - `id`: string

**Response**: 204 No Content

**Status Codes**:
- 204: No Content
- 404: Not Found

## Image Processing

### Planned Features

- **Resizing**: Automatic image resizing
- **Compression**: Lossless/lossy compression
- **Format Conversion**: Convert to WebP
- **Thumbnail Generation**: Create thumbnails
- **Watermarking**: Add watermarks
- **Optimization**: Automatic optimization

### Processing Pipeline

```
Upload → Validation → Processing → Storage → Metadata
  ↓         ↓           ↓          ↓          ↓
Client   Business   Image     Provider  Database
         Rules    Processing
```

## Image Association

### Entity Types

**Supported Entities**:
- `user`: User avatars and profile images
- `product`: Product images
- `post`: Post images (planned)
- `other`: Other entity types
- `merchant`: Merchant images (planned)

### Association Rules

- One entity can have multiple images
- Images can be associated with only one entity
- Cascade delete: Delete entity → Delete associated images
- Soft delete: Mark images as deleted (planned)

## Validation Rules

### MIME Type Validation

**Allowed Types**:
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`
- `image/svg+xml`

**Validation**: Check against allowed types list

### Size Validation

**Default Max Size**: 10MB

**Validation**: Compare file size against max size

**Business Rules** (from `@gv/business-rules`):
- Max size: 5MB
- Max images per product: 5

## Error Handling

### Image Errors

- `InvalidImageTypeError`: Unsupported MIME type
- `ImageSizeExceededError`: File too large
- `ImageNotFoundError`: Image not found
- `StorageError`: Storage provider error
- `ProcessingError`: Image processing error

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: "INVALID_IMAGE_TYPE",
    message: "Unsupported image type",
    details: {
      mimeType: "image/tiff",
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    }
  }
}
```

## Performance Optimization

### CDN Integration

- **Cloudflare R2**: Built-in CDN
- **Image Optimization**: CDN-level optimization
- **Caching**: Browser and CDN caching
- **Lazy Loading**: Load images on demand

### Storage Optimization

- **Compression**: Reduce file sizes
- **Format Conversion**: Use modern formats (WebP)
- **Thumbnail Generation**: Serve smaller versions
- **Progressive Loading**: Progressive image formats

## Security

### Access Control

- **Authentication**: Required for upload
- **Authorization**: Check entity ownership
- **Public URLs**: CDN access for public images
- **Signed URLs**: Temporary access for private images

### File Security

- **Validation**: Validate file content (not just extension)
- **Sanitization**: Remove malicious content
- **Quotas**: Limit storage per user
- **Rate Limiting**: Prevent abuse

## Monitoring

### Metrics

- **Upload Count**: Number of images uploaded
- **Upload Size**: Total bytes uploaded
- **Storage Usage**: Total storage consumed
- **Error Rate**: Upload failure rate
- **Processing Time**: Image processing duration

### Logging

- **Upload Events**: Log all uploads with metadata
- **Error Events**: Log all image errors
- **Access Events**: Log image access patterns
- **Storage Events**: Log storage operations

## Source Traceability

**Source Folders**:
- `apps/api/src/application/use-cases/` - Image use cases
- `apps/api/src/interfaces/http/controllers/` - Image controller
- `apps/api/src/interfaces/http/routes/` - Image routes
- `apps/api/src/infrastructure/database/repositories/` - Image repository
- `apps/api/src/infrastructure/storage/` - Storage adapters

**Key Files**:
- `apps/api/src/application/use-cases/upload-image.use-case.ts` - Upload use case
- `apps/api/src/application/use-cases/delete-image.use-case.ts` - Delete use case
- `apps/api/src/application/use-cases/get-image.use-case.ts` - Get use case
- `apps/api/src/application/use-cases/list-images.use-case.ts` - List use case
- `apps/api/src/interfaces/http/controllers/image.controller.ts` - Image controller
- `apps/api/src/interfaces/http/routes/image.routes.ts` - Image routes
- `apps/api/src/infrastructure/database/repositories/image.repository.ts` - Image repository
- `apps/api/src/infrastructure/database/schema/image.schema.ts` - Image schema

**Dependencies**:
- `@gv/domain` - Image entity
- `@gv/contracts` - Image DTOs
- `@gv/business-rules` - Image business rules
- `@gv/storage` - Storage package

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- `@gv/domain` - Image entity
- `@gv/contracts` - Image DTOs
- `@gv/business-rules` - Business rules
- `@gv/storage` - Storage adapters
