module.exports = {
  attributes: {
    service: {
      model: 'service',
      required: true,
    },

    glSteps: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [
        // { order, amount, debitLevel, debitTarget, creditLevel, creditTarget },
      ],
    },
  },
};
