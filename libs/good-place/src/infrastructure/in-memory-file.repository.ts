import { FileRepository } from '../application/file.repository';

export class InMemoryFileRepository implements FileRepository {
  files: { [key: string]: Buffer } = {};
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
    this.files[fileName] = file;
    return Promise.resolve(fileName);
  }
}
