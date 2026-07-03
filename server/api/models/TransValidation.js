module.exports = {
  attributes: {
    service: {
      model: 'service',
      required: true,
    },

    order: {
      type: 'number',
      required: true,
    },

    validateFunc: {
      type: 'string',
      required: true,
    },

    validateFields: {
      type: 'string',
      required: true,
    },

    errorCode: {
      type: 'string',
    },

    status: {
      type: 'boolean',
      defaultsTo: true,
    },
  },
};
