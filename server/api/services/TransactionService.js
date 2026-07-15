const CashInService = require('./CashInService');

module.exports = {
  request: async function (body, user) {
    return await NeonMessage.routeProcess({ TRANSTEP: 1, user, body });
  },

  confirm: async function (body, user) {
    return await NeonMessage.routeProcess({ TRANSTEP: 2, user, body });
  },

  verify: async function (body, user) {
    return await NeonMessage.routeProcess({ TRANSTEP: 3, user, body });
  },

  history: async function (user, filters = {}) {
    const isAdmin = user.role === 'admin';
    let pocket = null;
    let whereClause = {};

    if (isAdmin) {
      // Admin can see all transactions
      whereClause = {};
    } else {
      // Regular user can only see their own transactions
      const customerId = user.id;
      pocket = await Pocket.findOne({ owner: customerId });

      if (!pocket) {
        return { pocket: null, transactions: [] };
      }

      whereClause = {
        or: [{ senderPocket: pocket.id }, { receiverPocket: pocket.id }],
      };
    }

    // Apply filters
    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.transRefId) {
      whereClause.transRefId = { contains: filters.transRefId };
    }

    if (filters.minAmount) {
      whereClause.amount = { ...whereClause.amount, '>=': filters.minAmount };
    }

    if (filters.maxAmount) {
      whereClause.amount = { ...whereClause.amount, '<=': filters.maxAmount };
    }

    if (filters.startDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        '>=': filters.startDate,
      };
    }

    if (filters.endDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        '<=': filters.endDate,
      };
    }

    // Apply sorting
    const sortField = filters.sortField || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    const sortOption = `${sortField} ${sortOrder}`;

    const transactions = await Transaction.find(whereClause).sort(sortOption);

    // Manually populate pockets since Sails populate might not be working
    const pocketIds = [
      ...transactions.map((t) => t.senderPocket),
      ...transactions.map((t) => t.receiverPocket),
    ].filter(Boolean);

    const pockets = await Pocket.find({ id: pocketIds }).populate('owner');
    const pocketMap = {};
    pockets.forEach((p) => {
      pocketMap[p.id] = p;
    });

    const populatedTransactions = transactions.map((t) => ({
      ...t,
      senderPocket: pocketMap[t.senderPocket] || null,
      receiverPocket: pocketMap[t.receiverPocket] || null,
    }));

    return { pocket, transactions: populatedTransactions };
  },

  // Cash-in methods - delegated to CashInService
  requestCashIn: async function (body, user) {
    return await CashInService.request(body);
  },

  confirmCashIn: async function (body, user) {
    return await CashInService.confirm(body);
  },

  getCashInHistory: async function () {
    return await CashInService.getHistory();
  },

  getCashInServices: async function () {
    return await CashInService.getServices();
  },
};
