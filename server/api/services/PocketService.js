const crypto = require('crypto');

function generateChecksum(data) {
  const secret = sails.config.custom.checksumSecret;

  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(data))
    .digest('hex');
}

function buildChecksumData(pocket) {
  return {
    owner: pocket.owner ? String(pocket.owner) : null,
    type: pocket.type,
    currency: pocket.currency,
    balance: pocket.balance,
  };
}

function verifyChecksum(pocket) {
  const expected = generateChecksum(buildChecksumData(pocket));

  return pocket.checksum === expected;
}

module.exports = {
  generateChecksum,
  buildChecksumData,
  verifyChecksum,

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
      checksum: generateChecksum({
        owner: ownerId,
        type,
        currency,
        balance: 0,
      }),
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

  findByOwner: async (ownerId) => {
    const pocket = await Pocket.findOne({ owner: ownerId });

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

    return pocket.balance;
  },

  getAll: async () => {
    const wallets = await Pocket.find().populate('owner');

    return wallets.map((wallet) => ({
      ...wallet,
      owner: wallet.owner
        ? {
          id: wallet.owner.id,
          phone: wallet.owner.phone,
          name: wallet.owner.name,
          email: wallet.owner.email,
          role: wallet.owner.role,
          status: wallet.owner.status,
        }
        : null,
    }));
  },

  getTransactions: async (pocketId) => {
    const pocket = await Pocket.findOne({ id: pocketId });

    if (!pocket) {
      throw new Error('Không tìm thấy ví');
    }

    const whereClause = {
      or: [{ senderPocket: pocketId }, { receiverPocket: pocketId }],
    };

    const transactions =
      await Transaction.find(whereClause).sort('createdAt DESC');

    // Populate pockets
    const pocketIds = [
      ...transactions.map((t) => t.senderPocket),
      ...transactions.map((t) => t.receiverPocket),
    ].filter(Boolean);

    const pockets = await Pocket.find({ id: pocketIds });
    const pocketMap = {};
    pockets.forEach((p) => {
      pocketMap[p.id] = p;
    });

    // Populate customers for pockets
    const ownerIds = pockets.map((p) => p.owner).filter(Boolean);
    const customers = await Customer.find({ id: ownerIds });
    const customerMap = {};
    customers.forEach((c) => {
      customerMap[c.id] = c;
    });

    const populatedTransactions = transactions.map((t) => ({
      ...t,
      senderPocket: pocketMap[t.senderPocket]
        ? {
          ...pocketMap[t.senderPocket],
          owner: customerMap[pocketMap[t.senderPocket].owner] || null,
        }
        : null,
      receiverPocket: pocketMap[t.receiverPocket]
        ? {
          ...pocketMap[t.receiverPocket],
          owner: customerMap[pocketMap[t.receiverPocket].owner] || null,
        }
        : null,
    }));

    return populatedTransactions;
  },
};
