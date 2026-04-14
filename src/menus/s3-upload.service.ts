import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

const ALLOWED_MIME = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

@Injectable()
export class S3UploadService {
  private client: S3Client | null = null;

  private getClient(): S3Client {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException(
        'S3 is not configured (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)',
      );
    }
    if (!this.client) {
      this.client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    }
    return this.client;
  }

  async uploadMenuImage(
    storeId: number,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const ext = ALLOWED_MIME.get(mimeType);
    if (!ext) {
      throw new BadRequestException(
        `Unsupported image type: ${mimeType}. Use jpeg, png, webp, or gif.`,
      );
    }
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new InternalServerErrorException('S3_BUCKET is not set');
    }
    const region = process.env.AWS_REGION;
    if (!region) {
      throw new InternalServerErrorException('AWS_REGION is not set');
    }

    const key = `menus/${storeId}/${randomUUID()}${ext}`;

    try {
      await this.getClient().send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        }),
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'S3 upload failed';
      throw new InternalServerErrorException(msg);
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
