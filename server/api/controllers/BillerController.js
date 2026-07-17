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
