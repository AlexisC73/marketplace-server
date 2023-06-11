import { File } from '../domain/file';

export const createFileFixture = ({ fileRepository }) => {
  return {
    givenFileExist: (files: File[]) => {
      files.map((f) => fileRepository._save(f));
    },
    thenFileShouldNotExist: async (url: string) => {
      const file = fileRepository.files[url];
      expect(file).not.toBeDefined();
    },
    thenFileShouldExist: async (url: string) => {
      const file = fileRepository.files[url];
      expect(file).toBeDefined();
    },
  };
};

export type FileFixture = ReturnType<typeof createFileFixture>;
