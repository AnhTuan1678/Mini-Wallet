module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },

    inquiryUrl: {
      type: 'string',
      required: true,
    },

    paymentUrl: {
      type: 'string',
      required: true,
    },

    pocket: {
      model: 'pocket',
      required: true,
    },
  },
};
