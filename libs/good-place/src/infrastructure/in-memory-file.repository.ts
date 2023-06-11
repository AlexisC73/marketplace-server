import { FileRepository } from '../application/file.repository';
import { File } from '../domain/file';

export class InMemoryFileRepository implements FileRepository {
  files: { [key: string]: { file: Buffer; mimetype: string } } = {};
  async save({
    file,
    fileName,
    mimetype,
    saveDirectory,
  }: File): Promise<string> {
    this._save({ file, fileName, mimetype, saveDirectory });
    return Promise.resolve(saveDirectory + '/' + fileName);
  }

  delete(url: string): Promise<void> {
    if (url === 'avatar/default-avatar.jpg') {
      return;
    } else {
      delete this.files[url];
    }
  }

  _save(file: File) {
    this.files[file.saveDirectory + '/' + file.fileName] = {
      file: file.file,
      mimetype: file.mimetype,
    };
  }
}
