const sanitizeId = (id) => {
  return id.replace(/[.@]/g, "_");
};

export default sanitizeId;
