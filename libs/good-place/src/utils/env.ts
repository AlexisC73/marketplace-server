const defaultImageUrl =
  process.env.DEFAULT_IMAGE_URL || 'avatar/default-avatar.png';

const defaultSaveDirectory = process.env.DEFAULT_SAVE_DIRECTORY || 'avatar';

const env = {
  defaultImageUrl,
  defaultSaveDirectory,
};

export default env;
