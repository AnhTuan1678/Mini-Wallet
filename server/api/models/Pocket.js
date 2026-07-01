module.exports = {
  attributes: {
    owner: {
      model: 'customer',
      required: true,
    },

    balance: {
      type: 'number',
      // defaultsTo: 0,
      required: true,
    },

    type: {
      type: 'string',
      required: true,
      isIn: ['CUSTOMER', 'BANK', 'BILLER', 'AGENT'],
    },

    status: {
      type: 'string',
      required: true,
      isIn: ['ACTIVE', 'LOCKED'],
    },

    currency: {
      type: 'string',
      defaultsTo: 'VND',
      // required: true,
    },

    checksum: {
      type: 'string',
      required: true,
    },
  },
};
