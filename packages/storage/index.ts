// @gv/storage

export type StorageProviderType = 'cloudflare' | 'google_drive' | 's3' | 'minio' | 'local';

export interface StorageConfig {
  provider: StorageProviderType;
  cloudflare?: {
    accountId: string;
    apiKey: string;
    bucketName: string;
    publicUrl: string;
  };
  googleDrive?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    folderId: string;
  };
  s3?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
    endpoint?: string;
  };
  local?: {
    uploadDir: string;
  };
}

export interface StorageFile {
  key: string;
  url: string;
  provider: StorageProviderType;
  size: number;
  mimeType: string;
}

export interface IStorageService {
  upload(file: Buffer | Uint8Array, fileName: string, mimeType: string): Promise<StorageFile>;
  delete(providerFileId: string): Promise<void>;
  getUrl(providerFileId: string): Promise<string>;
}
