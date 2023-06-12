import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { FileRepository } from '../application/file.repository';
import env from '../utils/env';

export class S3FileRepository implements FileRepository {
  readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  constructor(
    private readonly bucketName: string = process.env.AWS_S3_BUCKET_NAME,
  ) {}

  async save({
    file,
    fileName,
    mimetype,
    saveDirectory,
  }: {
    file: Buffer;
    fileName: string;
    mimetype: string;
    saveDirectory: string;
  }): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: saveDirectory + '/' + fileName,
        Body: file,
        ContentType: mimetype,
        ACL: 'public-read',
      }),
    );

    return `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${saveDirectory}/${fileName}`;
  }

  async delete(imageUrl: string): Promise<void> {
    const image = imageUrl.split('amazonaws.com/').pop();
    if (!image) {
      return;
    }
    if (image === env.defaultSaveDirectory + '/default-avatar.jpeg') {
      return;
    }
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: image,
      }),
    );
  }
}
