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

    symbol: {
      type: 'string',
      required: true,
    },
  },
};
