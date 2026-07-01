module.exports = function (data = {}) {
  return this.res.json({
    ...HttpResponses.BAD_REQUEST,
    ...data,
  });
};
