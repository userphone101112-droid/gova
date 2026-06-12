/**
 * Google Drive Storage Adapter
 * 
 * Implementation of image storage using Google Drive API.
 * This adapter implements the IImageStorageProvider interface.
 */

import { google } from 'googleapis';
import { Readable } from 'stream';
import { IImageStorageProvider, ImageUploadResult, ImageMetadata } from '@/application/ports/image-storage.port.js';

export class GoogleDriveStorageAdapter implements IImageStorageProvider {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;
  private readonly folderId?: string;

  constructor(config: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    folderId?: string;
  }) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.refreshToken = config.refreshToken;
    this.folderId = config.folderId;
  }

  private getDriveClient() {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret
    );
    oauth2Client.setCredentials({
      refresh_token: this.refreshToken,
    });
    return google.drive({ version: 'v3', auth: oauth2Client });
  }

  async upload(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ImageUploadResult> {
    try {
      const drive = this.getDriveClient();

      const fileMetadata = {
        name: `${Date.now()}-${fileName}`,
        parents: this.folderId ? [this.folderId] : undefined,
      };

      const media = {
        mimeType: mimeType,
        body: Readable.from(file),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });

      const fileId = response.data.id;
      if (!fileId) {
        throw new Error('Google Drive upload did not return file ID');
      }

      // Make file public/shareable so it can be accessed
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const url = `https://drive.google.com/uc?export=view&id=${fileId}`;

      return {
        url,
        providerFileId: fileId,
        mimeType,
        size: file.length,
      };
    } catch (error) {
      throw new Error(`Google Drive upload failed: ${error}`);
    }
  }

  async delete(fileId: string): Promise<void> {
    try {
      const drive = this.getDriveClient();
      await drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      throw new Error(`Google Drive delete failed: ${error}`);
    }
  }

  getPublicUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  async getMetadata(fileId: string): Promise<ImageMetadata> {
    try {
      const drive = this.getDriveClient();
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'mimeType, size',
      });

      return {
        mimeType: response.data.mimeType || 'image/jpeg',
        size: response.data.size ? parseInt(response.data.size, 10) : 0,
      };
    } catch (error) {
      throw new Error(`Google Drive metadata fetch failed: ${error}`);
    }
  }
}
