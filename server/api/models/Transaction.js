module.exports = {
  attributes: {
    transRefId: {
      type: 'string',
      required: true,
      unique: true,
    },

    service: {
      model: 'service',
      required: true,
    },

    senderPocket: {
      model: 'pocket',
      required: true,
    },

    receiverPocket: {
      model: 'pocket',
      required: true,
    },

    amount: {
      type: 'number',
      required: true,
    },

    fee: {
      type: 'number',
      required: true,
    },

    totalAmount: {
      type: 'number',
      required: true,
    },

    status: {
      type: 'string',
      required: true,
    },

    message: {
      type: 'string',
      required: true,
    },
  },
};
