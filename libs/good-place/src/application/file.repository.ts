export abstract class FileRepository {
  abstract save({
    file,
    fileName,
  }: {
    file: Buffer;
    fileName: string;
  }): Promise<string>;
}
