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

    // billerTrans: service cần gọi inquiry/payment URL của Biller ở runtime.
    action: {
      type: 'string',
      isIn: ['none', 'billerTrans'],
      defaultsTo: 'none',
    },

    fieldBuilders: {
      collection: 'fieldbuilder',
      via: 'service',
    },

    transFields: {
      collection: 'transfield',
      via: 'service',
    },

    validations: {
      collection: 'transvalidation',
      via: 'service',
    },

    definition: {
      model: 'transdefinition',
    },
  },
};
