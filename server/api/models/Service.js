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
      isIn: ['transfer', 'cash-in', 'bill-payment', 'service'],
      defaultsTo: 'transfer',
    },

    authMethod: {
      type: 'string',
      isIn: ['pin', 'none', 'otp'],
      defaultsTo: 'pin',
    },

    feeType: {
      type: 'string',
      isIn: ['fixed', 'percent'],
      defaultsTo: 'fixed',
    },

    feeValue: {
      type: 'number',
      defaultsTo: 0,
    },

    feeMax: {
      type: 'number',
      defaultsTo: Number.MAX_SAFE_INTEGER,
    },

    feeMin: {
      type: 'number',
      defaultsTo: 0,
    },

    status: {
      type: 'boolean',
      defaultsTo: true,
    },

    fieldBuilders: {
      collection: 'fieldBuilder',
      via: 'service',
    },

    transFields: {
      collection: 'transField',
      via: 'service',
    },

    validations: {
      collection: 'transValidation',
      via: 'service',
    },

    definition: {
      model: 'transDefinition',
    },
  },
};
