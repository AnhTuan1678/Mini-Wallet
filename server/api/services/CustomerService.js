const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async ({ name, email, password, pin, phone }) => {
    // Kiểm tra số điện thoại hoặc email đã tồn tại
    const existPhone = await Customer.findOne({ phone });

    if (existPhone) {
      throw new Error('Số điện thoại đã tồn tại');
    }

    // Hash mật khẩu và mã PIN
    const passwordHash = await bcrypt.hash(password, 10);
    const pinHash = await bcrypt.hash(pin, 10);

    // Tạo tài khoản
    const customer = await Customer.create({
      name,
      email,
      password: passwordHash,
      pin: pinHash,
      phone,
    }).fetch();

    // Tạo Pocket
    const pocket = await PocketService.create(customer.id);

    return { customer, pocket };
  },

  login: async ({ phone, password }) => {
    const customer = await Customer.findOne({ phone });

    if (!customer) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const validPassword = await bcrypt.compare(password, customer.password);

    if (!validPassword) {
      throw new Error('Sai mật khẩu');
    }

    const payload = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
    };

    const token = jwt.sign(payload, sails.config.custom.jwtSecret, {
      expiresIn: sails.config.custom.jwtExpiresIn,
    });

    return { customer: payload, token };
  },

  me: async (id) => {
    const customer = await Customer.findOne({ id });

    if (!customer) {
      throw new Error('Không tìm thấy tài khoản');
    }

    return _.omit(customer, ['password', 'pin']);
  },

  updateMe: async (id, { name, email }) => {
    const customer = await Customer.findOne({ id });

    if (!customer) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const updatedCustomer = await customer.update({
      name,
      email,
    });

    return updatedCustomer;
  },

  changePassword: async (id, { oldPassword, newPassword }) => {
    const customer = await Customer.findOne({ id });

    if (!customer) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const validPassword = await bcrypt.compare(oldPassword, customer.password);

    if (!validPassword) {
      throw new Error('Sai mật khẩu');
    }

    const updatedCustomer = await customer.update({
      password: newPassword,
    });

    return updatedCustomer;
  },

  changePin: async (id, { oldPin, newPin }) => {
    const customer = await Customer.findOne({ id });

    if (!customer) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const validPin = await bcrypt.compare(oldPin, customer.pin);

    if (!validPin) {
      throw new Error('Sai mã PIN');
    }

    const updatedCustomer = await customer.update({
      pin: newPin,
    });

    return updatedCustomer;
  },

  getAll: async () => {
    const customers = await Customer.find().sort('createdAt DESC');
    sails.log.info(`Found ${customers.length} customers`);

    return customers.map((customer) => _.omit(customer, ['password', 'pin']));
  },

  updateStatus: async (id, { status }) => {
    const customer = await Customer.findOne({ id });

    if (!customer) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'];

    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ');
    }

    const updatedCustomer = await Customer.updateOne({ id }).set({ status });

    return _.omit(updatedCustomer, ['password', 'pin']);
  },
};
