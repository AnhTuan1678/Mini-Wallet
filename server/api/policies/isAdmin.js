module.exports = async function (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.forbidden({ message: 'Bạn không có quyền truy cập' });
};
