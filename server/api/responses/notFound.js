module.exports = function (data = {}) {
  return this.res.json({
    ...HttpResponses.NOT_FOUND,
    ...data,
  });
};
