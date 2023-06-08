import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { FileRepository } from '../application/file.repository';

export class S3FileRepository implements FileRepository {
  readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  constructor(
    private readonly defaultImageUrl: string = process.env
      .AWS_S3_IMAGE_DEFAULT_URL,
    private readonly bucketName: string = process.env.AWS_S3_BUCKET_NAME,
  ) {}

  async save({
    file,
    fileName,
    mimetype,
  }: {
    file: Buffer;
    fileName: string;
    mimetype: string;
  }): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: 'avatar/' + fileName,
        Body: file,
        ContentType: mimetype,
        ACL: 'public-read',
      }),
    );

    return `${this.defaultImageUrl}/avatar/${fileName}`;
  }
}
