export abstract class FileRepository {
  abstract save({
    file,
    fileName,
    mimetype,
  }: {
    file: Buffer;
    fileName: string;
    mimetype: string;
  }): Promise<string>;
}
