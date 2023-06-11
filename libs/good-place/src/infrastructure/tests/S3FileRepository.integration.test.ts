import * as dotenv from 'dotenv';
dotenv.config();

import { S3FileRepository } from '../S3FileRepository';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fileBuilder } from '../../tests/fileBuilder';

const bucketName = process.env.AWS_S3_TEST_BUCKET_NAME;
const saveDirectory = 'avatar';

describe('S3FileRepository', () => {
  let s3FileRepository: S3FileRepository;
  let fileNameToDelete: string[] = [];

  beforeAll(() => {
    s3FileRepository = new S3FileRepository(bucketName);
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
      saveDirectory: saveDirectory,
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

  test('delete() should delete an image in S3', async () => {
    const savedFile = fileBuilder()
      .withFileName('test.jpg')
      .withSaveDirectory('avatar')
      .build();

    const key = `${savedFile.saveDirectory}/${savedFile.fileName}`;
    const url = `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;

    await s3FileRepository.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: savedFile.file,
        ACL: 'public-read',
        ContentType: savedFile.mimetype,
      }),
    );

    await s3FileRepository.delete(key);

    const fetchedData = await fetch(url);
    expect(fetchedData.status).toBe(403);
  });
});

async function cleanFile(fileNames: string[], s3Client: S3Client) {
  await Promise.all(
    fileNames.map(async (fileName) => {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: saveDirectory + '/' + fileName,
        }),
      );
    }),
  );
}
