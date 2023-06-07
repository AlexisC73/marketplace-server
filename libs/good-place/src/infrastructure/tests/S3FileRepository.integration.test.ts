import * as dotenv from 'dotenv';
dotenv.config();

import { S3FileRepository } from '../S3FileRepository';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_S3_TEST_BUCKET_NAME;
const defaultImageUrl = process.env.AWS_S3_IMAGE_TEST_URL;

describe('S3FileRepository', () => {
  let s3FileRepository: S3FileRepository;
  let fileNameToDelete: string[] = [];

  beforeAll(() => {
    s3FileRepository = new S3FileRepository(defaultImageUrl, bucketName);
  });

  beforeEach(async () => {
    if (fileNameToDelete.length <= 0) return;
    await cleanFile(fileNameToDelete, s3FileRepository.s3Client);
  });

  afterAll(async () => {
    if (fileNameToDelete.length <= 0) return;
    await cleanFile(fileNameToDelete, s3FileRepository.s3Client);
  });

  test('save() should save an image in S3 and return her url', async () => {
    const textSend = "I'm a test for aws s3";
    const mimetype = 'image/jpg';
    const image = Buffer.from(textSend);
    const file = image;
    const fileName = 'autre.jpg';

    const url = await s3FileRepository.save({
      file,
      fileName,
      mimetype,
    });
    fileNameToDelete.push(fileName);

    const fetchedData = await fetch(url);
    const resultBuffer = Buffer.from(await fetchedData.arrayBuffer()).toString(
      'utf-8',
    );

    const dataType = fetchedData.headers.get('content-type');

    expect(resultBuffer).toBe(textSend);
    expect(dataType).toBe(mimetype);
  });
});

async function cleanFile(fileNames: string[], s3Client: S3Client) {
  await Promise.all(
    fileNames.map(async (fileName) => {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fileName,
        }),
      );
    }),
  );
}