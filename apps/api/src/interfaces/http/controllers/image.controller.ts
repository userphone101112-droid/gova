/**
 * Image Controller
 * 
 * Controller for image-related HTTP endpoints.
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { UploadImageUseCase } from '@/application/use-cases/upload-image.use-case.js';
import { DeleteImageUseCase } from '@/application/use-cases/delete-image.use-case.js';
import { GetImageUseCase } from '@/application/use-cases/get-image.use-case.js';
import { ListImagesUseCase } from '@/application/use-cases/list-images.use-case.js';
import { ImageResponseDTO } from '@/application/dto/image.dto.js';
import { uploadImageSchema } from '../validators/image.validator.js';

export class ImageController {
  constructor(
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
    private readonly getImageUseCase: GetImageUseCase,
    private readonly listImagesUseCase: ListImagesUseCase
  ) {}

  async upload(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file provided' });
      }

      // Convert fields to a plain object
      const body: Record<string, any> = {};
      for (const [key, field] of Object.entries(data.fields)) {
        if (field) {
          if (Array.isArray(field)) {
            body[key] = field.map((f: any) => f.value);
          } else {
            body[key] = (field as any).value;
          }
        }
      }

      // Validate the fields (excluding file, which we handle manually)
      const validationResult = uploadImageSchema.safeParse({
        file: {}, // Dummy value to pass validation
        fileName: body.fileName || data.filename,
        mimeType: body.mimeType || data.mimetype,
        entityType: body.entityType,
        entityId: body.entityId,
      });

      if (!validationResult.success) {
        return reply.status(400).send({ error: validationResult.error.format() });
      }

      const validated = validationResult.data;
      const buffer = await data.toBuffer();

      const image = await this.uploadImageUseCase.execute({
        file: buffer,
        fileName: validated.fileName,
        mimeType: validated.mimeType,
        entityType: validated.entityType,
        entityId: validated.entityId,
      });

      const response: ImageResponseDTO = {
        id: image.id,
        url: image.url,
        provider: image.provider,
        providerFileId: image.providerFileId,
        entityType: image.entityType,
        entityId: image.entityId,
        mimeType: image.mimeType,
        size: image.size,
        width: image.width,
        height: image.height,
        createdAt: image.createdAt,
      };

      return reply.status(201).send(response);
    } catch (error) {
      console.error('Image upload controller error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.deleteImageUseCase.execute(id);
    return reply.status(204).send();
  }

  async get(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const image = await this.getImageUseCase.execute(id);

    const response: ImageResponseDTO = {
      id: image.id,
      url: image.url,
      provider: image.provider,
      providerFileId: image.providerFileId,
      entityType: image.entityType,
      entityId: image.entityId,
      mimeType: image.mimeType,
      size: image.size,
      width: image.width,
      height: image.height,
      createdAt: image.createdAt,
    };

    return reply.send(response);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { limit?: string; offset?: string };
    const result = await this.listImagesUseCase.execute({
      limit: query.limit ? parseInt(query.limit) : undefined,
      offset: query.offset ? parseInt(query.offset) : undefined,
    });

    return reply.send(result);
  }
}
