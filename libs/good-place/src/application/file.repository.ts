export abstract class FileRepository {
  abstract save({
    file,
    fileName,
    mimetype,
  }: {
    file: Buffer;
    fileName: string;
    mimetype: string;
    saveDirectory: string;
  }): Promise<string>;

  abstract delete(image: string): Promise<void>;
}
