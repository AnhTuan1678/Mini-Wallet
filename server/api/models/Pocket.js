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
      isIn: ['active', 'inactive'],
      defaultsTo: 'active',
    },

    state: {
      type: 'string',
      defaultsTo: 'available',
      isIn: ['available', 'inProgress'],
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
