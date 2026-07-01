module.exports = function (data = {}) {
  return this.res.json({
    ...HttpResponses.SERVER_ERROR,
    ...data,
  });
};
