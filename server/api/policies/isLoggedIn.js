const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.badRequest({ message: 'Token không được cung cấp' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🚀 ~ isLoggedIn.js:14 ~ decoded:', decoded);
    req.user = decoded;

    return next();
  } catch (err) {
    sails.log.error('Lỗi xác thực token:', err.message);

    return res.badRequest({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
