const crypto = require('crypto');

function generateChecksum(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

module.exports = {
  create: async (ownerId, currency = 'VND') => {
    const customer = await Customer.findOne({ id: ownerId });

    if (!customer) {
      throw new Error('Không tìm thấy chủ sở hữu');
    }

    const type = customer.role;

    const pocket = await Pocket.create({
      owner: ownerId,
      type,
      currency,
      balance: 0,
      checksum: generateChecksum({ ownerId, type, currency, balance: 0 }),
    }).fetch();

    return pocket;
  },

  find: async (id) => {
    const pocket = await Pocket.findOne({ id });

    if (!pocket) {
      throw new Error('Không tìm thấy ví');
    }

    return pocket;
  },

  getTransaction: async (id) => {
    const pocket = await Pocket.findOne({ id });

    if (!pocket) {
      throw new Error('Không tìm thấy ví');
    }

    return pocket;
  },

  getBalance: async (id) => {
    const pocket = await Pocket.findOne({ id });

    if (!pocket) {
      throw new Error('Không tìm thấy ví');
    }

    return pocket;
  },
};
