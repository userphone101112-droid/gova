/**
 * Cloudflare Storage Adapter
 * 
 * Implementation of image storage using Cloudflare R2 via S3-compatible API.
 * This adapter implements the IImageStorageProvider interface.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { IImageStorageProvider, ImageUploadResult, ImageMetadata } from '@/application/ports/image-storage.port.js';

export class CloudflareStorageAdapter implements IImageStorageProvider {
  private readonly accountId: string;
  private readonly apiKey: string;
  private readonly bucketName: string;
  private readonly publicUrl: string;
  private readonly s3Client: S3Client;

  constructor(config: {
    accountId: string;
    apiKey: string;
    bucketName: string;
    publicUrl: string;
  }) {
    this.accountId = config.accountId;
    this.apiKey = config.apiKey;
    this.bucketName = config.bucketName;
    this.publicUrl = config.publicUrl;

    // Split apiKey if accessKeyId:secretAccessKey is provided, otherwise fallback
    const [accessKeyId, secretAccessKey] = this.apiKey.includes(':')
      ? this.apiKey.split(':')
      : [this.accountId, this.apiKey];

    this.s3Client = new S3Client({
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: 'auto',
    });
  }

  async upload(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ImageUploadResult> {
    try {
      const fileKey = `${Date.now()}-${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);

      const url = `${this.publicUrl}/${fileKey}`;

      return {
        url,
        providerFileId: fileKey,
        mimeType,
        size: file.length,
      };
    } catch (error) {
      throw new Error(`Cloudflare upload failed: ${error}`);
    }
  }

  async delete(fileId: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileId,
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new Error(`Cloudflare delete failed: ${error}`);
    }
  }

  getPublicUrl(fileId: string): string {
    return `${this.publicUrl}/${fileId}`;
  }

  async getMetadata(fileId: string): Promise<ImageMetadata> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: fileId,
      });

      const result = await this.s3Client.send(command);

      return {
        mimeType: result.ContentType || 'image/jpeg',
        size: result.ContentLength || 0,
      };
    } catch (error) {
      throw new Error(`Cloudflare metadata fetch failed: ${error}`);
    }
  }
}
