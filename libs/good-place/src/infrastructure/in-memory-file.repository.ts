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
    const imageName = saveDirectory + '/' + fileName;
    this.files[imageName] = file;
    return Promise.resolve(fileName);
  }

  delete(image: string): Promise<void> {
    if (!image) {
      return;
    }
    if (image === 'avatar/default-avatar.jpeg') {
      return;
    } else {
      delete this.files[image];
    }
  }
}
