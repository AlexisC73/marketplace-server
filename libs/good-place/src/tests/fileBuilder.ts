export const fileBuilder = ({
  file = Buffer.from('fake-file'),
  fileName = 'fake-file.jpg',
  mimetype = 'image/jpg',
  saveDirectory = 'default',
}: {
  file?: Buffer;
  fileName?: string;
  mimetype?: string;
  saveDirectory?: string;
} = {}) => {
  const props = { file, fileName, mimetype, saveDirectory };
  return {
    withFile: (file: Buffer) => fileBuilder({ ...props, file }),
    withFileName: (fileName: string) => fileBuilder({ ...props, fileName }),
    withMimetype: (mimetype: string) => fileBuilder({ ...props, mimetype }),
    withSaveDirectory: (saveDirectory: string) =>
      fileBuilder({ ...props, saveDirectory }),
    build: () => props,
  };
};
