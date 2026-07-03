module.exports = {
  attributes: {
    code: {
      type: 'string',
    },

    owner: {
      model: 'customer',
    },

    balance: {
      type: 'number',
      // defaultsTo: 0,
      required: true,
    },

    type: {
      type: 'string',
      isIn: ['customer', 'bank', 'biller', 'system'],
      defaultsTo: 'customer',
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
