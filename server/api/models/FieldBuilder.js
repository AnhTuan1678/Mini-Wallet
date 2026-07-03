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

    name: {
      type: 'string',
      required: true,
    },

    dataType: {
      type: 'string',
      isIn: ['string', 'number', 'boolean', 'date', 'object', 'array'],
      required: true,
    },

    rule: {
      type: 'string',
      isIn: ['fixed', 'mapping', 'query'],
      required: true,
    },

    // fixed
    value: {
      type: 'json',
    },

    // mapping
    source: {
      type: 'string',
      isIn: ['body', 'user', 'pocket'],
    },

    sourceField: {
      type: 'string',
    },

    // query
    query: {
      type: 'string',
    },

    queryFields: {
      type: 'json', // mảng chứa dữ liệu đầu vào
      columnType: 'array',
    },

    columns: {
      // cột lấy từ result của query
      type: 'json',
      columnType: 'array',
    },

    required: {
      type: 'boolean',
      defaultsTo: true,
    },

    error: {
      type: 'string',
    },
  },
};
