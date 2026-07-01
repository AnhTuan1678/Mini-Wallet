module.exports = function (data = {}) {
  return this.res.json({
    ...HttpResponses.SUCCESS,
    ...data,
  });
};
