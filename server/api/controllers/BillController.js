const normalizePhone = (phone) => {
  if (!phone) return '';
  return typeof phone === 'string' ? phone.trim().split(' - ')[0].trim() : '';
};

module.exports = {
  async getAll(_req, res) {
    try {
      const bills = await Bill.find().populate('biller').populate('customer');
      return res.ok({ bills });
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const bill = await Bill.findOne({ id })
        .populate('biller')
        .populate('customer');

      if (!bill) {
        return res.notFound({ message: 'Không tìm thấy hóa đơn.' });
      }

      return res.ok({ bill });
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { billerId, billCode, name, amount, customerId, customerPhone } =
        req.body;

      const bill = await Bill.findOne({ id });
      if (!bill) {
        return res.notFound({ message: 'Không tìm thấy hóa đơn.' });
      }

      if (bill.status === 'paid') {
        return res.badRequest({
          message: 'Không thể chỉnh sửa hóa đơn đã thanh toán.',
        });
      }

      if (
        !billerId ||
        !billCode ||
        !name ||
        amount === undefined ||
        amount === null
      ) {
        throw new Error('Thiếu thông tin hóa đơn.');
      }

      const biller = await Biller.findOne({ id: billerId, status: true });
      if (!biller) {
        throw new Error('Không tìm thấy nhà cung cấp.');
      }

      let customer = null;
      const normalizedPhone = normalizePhone(customerPhone);
      if (normalizedPhone) {
        customer = await Customer.findOne({ phone: normalizedPhone });
        if (!customer) {
          throw new Error('Không tìm thấy khách hàng với số điện thoại này.');
        }
      } else if (customerId) {
        customer = await Customer.findOne({ id: customerId });
        if (!customer) {
          throw new Error('Không tìm thấy khách hàng.');
        }
      }

      const updatedBill = await Bill.updateOne({ id }).set({
        biller: biller.id,
        customer: customer ? customer.id : null,
        billCode,
        name,
        amount: Number(amount),
      });

      return res.ok({ bill: updatedBill });
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { billerId, billCode, name, amount, customerId, customerPhone } =
        req.body;

      if (
        !billerId ||
        !billCode ||
        !name ||
        amount === undefined ||
        amount === null
      ) {
        throw new Error('Thiếu thông tin hóa đơn.');
      }

      const biller = await Biller.findOne({ id: billerId, status: true });
      if (!biller) {
        throw new Error('Không tìm thấy nhà cung cấp.');
      }

      let customer = null;
      const normalizedPhone = normalizePhone(customerPhone);
      if (normalizedPhone) {
        customer = await Customer.findOne({ phone: normalizedPhone });
        if (!customer) {
          throw new Error('Không tìm thấy khách hàng với số điện thoại này.');
        }
      } else if (customerId) {
        customer = await Customer.findOne({ id: customerId });
        if (!customer) {
          throw new Error('Không tìm thấy khách hàng.');
        }
      }

      const bill = await Bill.create({
        biller: biller.id,
        customer: customer ? customer.id : null,
        billCode,
        name,
        amount: Number(amount),
        status: 'unpaid',
      }).fetch();

      return res.created(bill);
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },
};
