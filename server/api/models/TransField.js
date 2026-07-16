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

    code: {
      type: 'string',
      required: true,
    },

    name: {
      type: 'string',
      required: true,
    },

    dataType: {
      type: 'string',
      isIn: ['string', 'number', 'boolean', 'date'],
      required: true,
    },

    // field bắt buộc phải có trong request hay không
    // true: bắt buộc phải kiểm tra, nếu không có thì trả về lỗi
    // false: không kiểm tra nếu không có
    isRequired: {
      type: 'boolean',
      defaultsTo: true,
    },

    minLength: {
      type: 'number',
    },

    maxLength: {
      type: 'number',
    },

    regex: {
      type: 'string',
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
