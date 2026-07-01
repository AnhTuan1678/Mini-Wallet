module.exports = {
  attributes: {
    code: {
      type: 'string',
      required: true,
      unique: true,
    },

    name: {
      type: 'string',
      required: true,
    },

    type: {
      type: 'string',
      required: true,
    },

    authMethod: {
      type: 'string',
      required: true,
    },

    fee: {
      type: 'json',
      defaultsTo: {
        type: 'flat', // [PERCENT, FLAT, NONE]
        value: 0,
        currency: 'VND',
        max: 0,
        min: 0,
      },
    },
  },
};
