# Storage System

## Overview

The storage system provides an abstraction layer for file storage operations, supporting multiple storage providers through an adapter pattern. Currently supports Cloudflare R2 and Google Drive with plans for S3 and MinIO.

## Architecture Pattern

### Adapter Pattern

The storage system uses the adapter pattern to:
- Provide a unified interface for storage operations
- Support multiple storage providers
- Enable easy switching between providers
- Facilitate testing with mock implementations

### Benefits

- **Provider Agnostic**: Application code doesn't depend on specific provider
- **Easy Migration**: Switch providers without changing application code
- **Testability**: Mock adapters for testing
- **Scalability**: Add new providers without modifying existing code

## Storage Interface

### IStorageAdapter

**Location**: `src/adapters/storage.adapter.ts`

**Purpose**: Defines the contract for storage providers

**Methods**:
- `upload(file: File, path: string): Promise<{ url: string }>` - Upload file
- `download(path: string): Promise<Blob>` - Download file
- `delete(path: string): Promise<void>` - Delete file
- `getMetadata(path: string): Promise<{ size: number; contentType: string }>` - Get file metadata
- `listFiles(prefix: string): Promise<{ path: string }[]>` - List files in directory

## Storage Adapters

### FirebaseStorageAdapter

**Location**: `src/adapters/storage.adapter.ts`

**Purpose**: Firebase Storage implementation

**Status**: Placeholder (not implemented)

**Provider**: Firebase Storage

**Features** (planned):
- Automatic CDN integration
- Built-in security rules
- Real-time listeners
- Client SDK integration

---

### S3StorageAdapter

**Location**: `src/adapters/storage.adapter.ts`

**Purpose**: AWS S3 implementation

**Status**: Placeholder (not implemented)

**Provider**: AWS S3

**Features** (planned):
- High durability and availability
- Lifecycle policies
- Versioning
- Cross-region replication

---

### Cloudflare Adapter

**Location**: `apps/api/src/infrastructure/storage/cloudflare.adapter.ts`

**Purpose**: Cloudflare R2 implementation

**Status**: Planned

**Provider**: Cloudflare R2

**Features**:
- S3-compatible API
- Zero egress fees
- Global edge network
- High performance

---

### Google Drive Adapter

**Location**: `apps/api/src/infrastructure/storage/google-drive.adapter.ts`

**Purpose**: Google Drive implementation

**Status**: Planned

**Provider**: Google Drive

**Features**:
- Familiar interface
- Built-in sharing
- Version history
- Collaboration features

---

## Storage Factory

### StorageFactory

**Location**: `apps/api/src/infrastructure/storage/storage.factory.ts`

**Purpose**: Creates storage provider based on configuration

**Implementation**:
```typescript
export class StorageFactory {
  static createProvider(): IImageStorageProvider {
    const provider = process.env.STORAGE_PROVIDER || 'cloudflare';
    
    switch (provider) {
      case 'cloudflare':
        return new CloudflareStorageAdapter();
      case 'google_drive':
        return new GoogleDriveStorageAdapter();
      case 's3':
        return new S3StorageAdapter();
      default:
        throw new Error(`Unknown storage provider: ${provider}`);
    }
  }
}
```

## Image Storage Interface

### IImageStorageProvider

**Location**: `apps/api/src/application/ports/image-storage.port.ts`

**Purpose**: Specialized interface for image storage operations

**Methods**:
- `upload(file: Buffer, fileName: string, mimeType: string): Promise<UploadResult>` - Upload image
- `delete(providerFileId: string): Promise<void>` - Delete image

**UploadResult**:
```typescript
{
  url: string,
  providerFileId: string,
  mimeType: string,
  size: number,
  width?: number,
  height?: number
}
```

## Storage Operations

### Upload Flow

```
Client → Upload Image
  ↓
ImageController.upload()
  ↓
UploadImageUseCase.execute()
  ↓
1. Validate file type
2. Validate file size
3. Upload to storage provider (IImageStorageProvider.upload)
4. Create Image entity
5. Save metadata to database (IImageRepository.create)
  ↓
Return ImageResponseDTO
```

### Delete Flow

```
Client → Delete Image
  ↓
ImageController.delete()
  ↓
DeleteImageUseCase.execute()
  ↓
1. Find image by ID (IImageRepository.findById)
2. Delete from storage provider (IImageStorageProvider.delete)
3. Delete metadata from database (IImageRepository.delete)
  ↓
Return 204 No Content
```

## Configuration

### Environment Variables

```bash
# Storage Provider Selection
STORAGE_PROVIDER=cloudflare  # cloudflare | google_drive | s3

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET=your-bucket-name

# Google Drive
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## File Naming Strategy

### Path Generation

**Pattern**: `{entityType}/{entityId}/{timestamp}-{filename}`

**Examples**:
- `user/abc123/1718320000-avatar.jpg`
- `product/def456/1718320001-main-image.png`

**Benefits**:
- Logical organization
- Easy to locate by entity
- Timestamp prevents conflicts
- Human-readable

## Security

### Access Control

- **Signed URLs**: Temporary access to private files
- **Public URLs**: CDN access for public files
- **Access Keys**: Secure credential management
- **IAM Roles**: Fine-grained permissions

### Data Protection

- **Encryption at Rest**: Provider-managed encryption
- **Encryption in Transit**: HTTPS/TLS
- **Backup**: Provider-managed backups
- **Versioning**: Optional file versioning

## Performance Optimization

### CDN Integration

- **Cloudflare R2**: Built-in CDN
- **AWS S3**: CloudFront integration
- **Google Drive**: Built-in caching

### Caching Strategy

- **Browser Caching**: Cache-Control headers
- **CDN Caching**: Edge caching
- **Application Caching**: In-memory cache for metadata

### Optimization Techniques

- **Image Optimization**: Automatic resizing/compression
- **Lazy Loading**: Load images on demand
- **Progressive Loading**: Progressive image formats
- **WebP Conversion**: Modern format support

## Error Handling

### Storage Errors

- **UploadError**: File upload failed
- **DownloadError**: File download failed
- **DeleteError**: File deletion failed
- **QuotaExceededError**: Storage quota exceeded
- **ProviderError**: Provider-specific error

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: "STORAGE_UPLOAD_ERROR",
    message: "Failed to upload file",
    details: {
      provider: "cloudflare",
      fileName: "image.jpg",
      reason: "Connection timeout"
    }
  }
}
```

## Monitoring

### Metrics

- **Upload Count**: Number of files uploaded
- **Upload Size**: Total bytes uploaded
- **Upload Duration**: Upload time metrics
- **Error Rate**: Upload failure rate
- **Storage Usage**: Total storage consumed

### Logging

- **Upload Events**: Log all uploads with metadata
- **Error Events**: Log all storage errors
- **Performance Events**: Log slow operations
- **Audit Trail**: Track file access

## Cost Management

### Cost Optimization

- **Lifecycle Policies**: Auto-delete old files
- **Compression**: Reduce file sizes
- **CDN Caching**: Reduce bandwidth costs
- **Storage Class**: Use appropriate storage tiers

### Monitoring

- **Cost Alerts**: Budget notifications
- **Usage Reports**: Regular usage analysis
- **Cost Allocation**: Track costs by entity

## Future Enhancements

### Planned Features

- **Multi-Provider Support**: Distribute files across providers
- **Automatic Failover**: Switch providers on failure
- **File Processing**: Automatic image optimization
- **Video Support**: Video upload and streaming
- **Document Support**: Document storage and preview
- **Archive Storage**: Cold storage for old files

### Advanced Features

- **Deduplication**: Eliminate duplicate files
- **Compression**: Automatic file compression
- **Encryption**: Client-side encryption
- **Chunked Upload**: Large file support
- **Resumable Uploads**: Resume interrupted uploads

## Source Traceability

**Source Folders**:
- `src/adapters/storage.adapter.ts` - Storage adapter interface
- `apps/api/src/infrastructure/storage/` - Storage implementations
- `apps/api/src/application/ports/image-storage.port.ts` - Image storage interface

**Key Files**:
- `src/adapters/storage.adapter.ts` - Storage adapter interface
- `apps/api/src/infrastructure/storage/storage.factory.ts` - Storage factory
- `apps/api/src/infrastructure/storage/cloudflare.adapter.ts` - Cloudflare adapter (planned)
- `apps/api/src/infrastructure/storage/google-drive.adapter.ts` - Google Drive adapter (planned)

**Dependencies**:
- None currently (planned: @aws-sdk/client-s3, @google-cloud/storage)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- `@gv/domain` - Image entity
- `@gv/contracts` - Image DTOs
