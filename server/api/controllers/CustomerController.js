const CustomerService = require('../services/CustomerService');
module.exports = {
  register: async (req, res) => {
    const { name = '', email = '', password, pin, phone } = req.body;

    try {
      const customer = await CustomerService.register({
        name,
        email,
        password,
        pin,
        phone,
      });

      return res.created(customer);
    } catch (err) {
      sails.log.error(err.message);

      return res.badRequest({
        message: err.message || 'Đăng ký thất bại',
      });
    }
  },

  login: async (req, res) => {
    const { phone, password } = req.body;
    try {
      const { customer, token } = await CustomerService.login({
        phone,
        password,
      });

      return res.ok({ token, ...customer });
    } catch (err) {
      sails.log.error(err.message);

      return res.badRequest({
        message: err.message || 'Đăng nhập thất bại',
      });
    }
  },

  me: async (req, res) => {
    try {
      const customer = await CustomerService.me(req.user.id);

      return res.ok(customer);
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  updateMe: async (req, res) => {
    const { name, email } = req.body;

    try {
      const customer = await CustomerService.updateMe(req.user.id, {
        name,
        email,
      });

      return res.ok(customer);
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
      const customer = await CustomerService.changePassword(req.user.id, {
        oldPassword,
        newPassword,
      });

      return res.ok(customer);
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  changePin: async (req, res) => {
    const { oldPin, newPin } = req.body;
    try {
      const customer = await CustomerService.changePin(req.user.id, {
        oldPin,
        newPin,
      });

      return res.ok(customer);
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const customers = await CustomerService.getAll();

      return res.ok({
        message: 'Thành công',
        data: customers,
      });
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const customer = await CustomerService.updateStatus(id, { status });

      return res.ok(customer);
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },
};
