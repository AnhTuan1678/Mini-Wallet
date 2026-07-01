module.exports = {
  attributes: {
    service: {
      model: 'service',
      required: true,
    },

    fileName: {
      type: 'string',
      required: true,
    },

    fileFormat: {
      type: 'string',
      required: true,
    },

    minLength: {
      type: 'number',
    },

    maxLength: {
      type: 'number',
    },

    dataType: {
      type: 'string',
      required: true,
    },

    isNumber: {
      type: 'boolean',
      defaultsTo: false,
    },

    numberFormat: {
      type: 'string',
    },

    isMandatory: {
      type: 'boolean',
      defaultsTo: false,
    },

    defaultValue: {
      type: 'string',
    },
  },
};
