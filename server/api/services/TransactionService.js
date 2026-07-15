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

  history: async function (user) {
    const customerId = user.id;

    const pocket = await Pocket.findOne({ owner: customerId });

    if (!pocket) {
      return { pocket: null, transactions: [] };
    }

    const transactions = await Transaction.find({
      or: [{ senderPocket: pocket.id }, { receiverPocket: pocket.id }],
    }).sort('createdAt DESC');

    return { pocket, transactions };
  },
};
