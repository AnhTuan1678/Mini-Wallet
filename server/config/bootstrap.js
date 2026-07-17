module.exports.bootstrap = async function (done) {
  global.HttpResponses = require('../api/constants/HttpResponses');

  // Tạo 1 tài khoản admin nếu chưa có
  const admin = await Customer.findOne({
    role: 'admin',
  });
  const bcrypt = require('bcrypt');

  if (!admin) {
    await Customer.create({
      phone: 'admin',
      email: 'admin@example.com',
      name: 'Admin',
      password: bcrypt.hashSync('1', 10),
      pin: bcrypt.hashSync('1', 10),
      role: 'admin',
    }).fetch();
  }

  done();
};
