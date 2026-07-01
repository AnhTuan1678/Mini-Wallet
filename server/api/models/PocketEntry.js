module.exports = {
  attributes: {
    transRefId: {
      type: 'string',
      required: true,
      unique: true,
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
  },
};
