module.exports = {
  attributes: {
    service: {
      model: 'service',
      required: true,
    },

    status: {
      type: 'string',
      isIn: [
        'init',
        'pending',
        'confirmed',
        'done',
        'failed',
        'cancelled',
        'expired',
      ],
      defaultsTo: 'init',
    },

    inputMessage: {
      type: 'json',
      defaultsTo: { transBody: {}, header: {} },
    },

    outputMessage: {
      type: 'json',
      defaultsTo: { transBody: {}, header: {} },
    },

    feeSnapshot: {
      type: 'number',
      defaultsTo: 0,
    },

    authMethod: {
      type: 'string',
      isIn: ['otp', 'pin', 'none'],
      defaultsTo: 'pin',
    },

    transStepLog: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },

    expiredAt: {
      type: 'number',
    },
  },
};
