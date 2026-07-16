module.exports = {
  async getAll(_req, res) {
    // Include billers created before the optional `status` field existed.
    const billers = (await Biller.find().sort('name ASC')).filter(
      (biller) => biller.status !== false
    );

    return res.ok({ billers });
  },

  async create(req, res) {
    try {
      const { name, inquiryUrl, paymentUrl, pocket } = req.body;

      if (!name || !inquiryUrl || !paymentUrl || !pocket) {
        throw new Error('Thiếu thông tin biller.');
      }

      return res.created(
        await Biller.create({ name, inquiryUrl, paymentUrl, pocket }).fetch()
      );
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },

  async getBillsForUser(req, res) {
    try {
      const { billerId } = req.params;
      const userId = req.user.id;

      const customer = await Customer.findOne({ id: userId });

      if (!customer) {
        return res.badRequest({ message: 'Không tìm thấy tài khoản.' });
      }

      let bills = await Bill.find({
        biller: billerId,
        customer: userId,
        status: 'unpaid',
      });

      if (bills.length === 0) {
        bills = await Bill.find({
          biller: billerId,
          status: 'unpaid',
        });
      }

      return res.ok({ bills });
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },
};
