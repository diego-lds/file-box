export const getFileExtension = (name) => {
  const extension = name.split(".");
  return extension[1];
};
