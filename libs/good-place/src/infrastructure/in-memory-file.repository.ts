import { FileRepository } from '../application/file.repository';

export class InMemoryFileRepository implements FileRepository {
  files: { [key: string]: Buffer } = {};
  async save({
    file,
    fileName,
  }: {
    file: Buffer;
    fileName: string;
  }): Promise<string> {
    this.files[fileName] = file;
    return Promise.resolve(fileName);
  }
}
