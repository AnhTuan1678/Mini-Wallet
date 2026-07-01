module.exports = {
  attributes: {
    service: {
      model: 'service',
      required: true,
    },

    transaction: {
      model: 'transaction',
      required: true,
    },

    status: {
      type: 'string',
      isIn: ['INIT', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
      defaultsTo: 'INIT',
      // required: true,
    },

    inputMessage: {
      type: 'json',
      defaultsTo: {},
    },

    outputMessage: {
      type: 'json',
      defaultsTo: {},
    },

    // transStepLog: {
    //   model: 'transStepLog',
    // },

    expiredAt: {
      type: 'ref',
      columnType: 'datetime',
    },
  },
};
