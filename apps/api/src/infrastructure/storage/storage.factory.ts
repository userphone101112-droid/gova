/**
 * Storage Factory
 * 
 * Factory for creating storage provider instances based on environment configuration.
 * This ensures the application layer never knows the provider type.
 */

import { IImageStorageProvider } from '@/application/ports/image-storage.port';
import { CloudflareStorageAdapter } from './cloudflare.storage';
import { GoogleDriveStorageAdapter } from './google-drive.storage';
import { env } from '@/config/env';

export class StorageFactory {
  static createProvider(): IImageStorageProvider {
    const provider = env.IMAGE_STORAGE_PROVIDER || 'cloudflare';

    switch (provider) {
      case 'cloudflare':
        return new CloudflareStorageAdapter({
          accountId: env.CLOUDFLARE_ACCOUNT_ID || '',
          apiKey: env.CLOUDFLARE_API_KEY || '',
          bucketName: env.CLOUDFLARE_BUCKET_NAME || '',
          publicUrl: env.CLOUDFLARE_PUBLIC_URL || '',
        });

      case 'google_drive':
        return new GoogleDriveStorageAdapter({
          clientId: env.GOOGLE_DRIVE_CLIENT_ID || '',
          clientSecret: env.GOOGLE_DRIVE_CLIENT_SECRET || '',
          refreshToken: env.GOOGLE_DRIVE_REFRESH_TOKEN || '',
          folderId: env.GOOGLE_DRIVE_FOLDER_ID,
        });

      default:
        throw new Error(`Unsupported storage provider: ${provider}`);
    }
  }
}
