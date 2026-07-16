module.exports = {
  async create(req, res) {
    try {
      const { billerId, billCode, name, amount, customerId } = req.body;

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

      const customer = customerId
        ? await Customer.findOne({ id: customerId })
        : null;

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
