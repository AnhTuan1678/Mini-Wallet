module.exports = {
  async getAll(_req, res) {
    // Include billers created before the optional `status` field existed.
    const billers = (await Biller.find().sort('name ASC')).filter(
      (biller) => biller.status !== false
    );

    return res.ok({ billers });
  },

  async update(req, res) {
    try {
      const { billerId } = req.params;
      const { name, inquiryUrl, paymentUrl, status } = req.body;

      const existing = await Biller.findOne({ id: billerId });
      if (!existing) {
        return res.notFound({ message: 'Không tìm thấy biller.' });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (inquiryUrl !== undefined) updateData.inquiryUrl = inquiryUrl;
      if (paymentUrl !== undefined) updateData.paymentUrl = paymentUrl;
      if (status !== undefined) updateData.status = status;

      const updated = await Biller.updateOne({ id: billerId }).set(updateData);
      const biller = await Biller.findOne({ id: billerId });

      return res.ok({ biller });
    } catch (error) {
      return res.badRequest({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, inquiryUrl, paymentUrl } = req.body;

      if (!name || !inquiryUrl || !paymentUrl) {
        throw new Error('Thiếu thông tin biller.');
      }

      const { generateChecksum } = require('../services/PocketService');

      // create a pocket for this biller
      const pocket = await Pocket.create({
        type: 'biller',
        balance: 0,
        checksum: generateChecksum({
          owner: null,
          type: 'biller',
          currency: 'VND',
          balance: 0,
        }),
      }).fetch();

      return res.created(
        await Biller.create({
          name,
          inquiryUrl,
          paymentUrl,
          pocket: pocket.id,
        }).fetch()
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
