module.exports = {
  attributes: {
    phone: {
      type: 'string',
      required: true,
      unique: true,
    },

    email: {
      type: 'string',
      unique: true,
    },

    password: {
      type: 'string',
      required: true,
      protect: true,
    },

    name: {
      type: 'string',
    },

    pin: {
      type: 'string',
      required: true,
      protect: true,
    },

    role: {
      type: 'string',
      isIn: ['customer', 'admin', 'biller', 'system', 'bank'],
      defaultsTo: 'customer',
    },

    status: {
      type: 'string',
      isIn: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'],
      defaultsTo: 'ACTIVE',
    },
  },
};
