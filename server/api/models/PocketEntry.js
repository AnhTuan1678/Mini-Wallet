module.exports = {
  attributes: {
    transRefId: {
      type: 'string',
      required: true,
      unique: true,
    },

    stepOrder: {
      type: 'number',
      required: true,
    },

    credit: {
      model: 'pocket',
      required: true,
    },

    debit: {
      model: 'pocket',
      required: true,
    },

    amount: {
      type: 'number',
      required: true,
    },

    status: {
      type: 'string',
      isIn: ['settled', 'failed'],
      defaultsTo: 'settled',
    },
  },
};
