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
      isIn: ['CUSTOMER', 'ADMIN', 'BILLER', 'SYSTEM', 'BANK'],
      defaultsTo: 'CUSTOMER',
    },

    status: {
      type: 'string',
      isIn: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'],
      defaultsTo: 'ACTIVE',
    },
  },
};
