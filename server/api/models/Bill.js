module.exports = {
  attributes: {
    biller: { model: 'biller', required: true },
    customer: { model: 'customer', required: true },
    billCode: { type: 'string', required: true },
    name: { type: 'string', required: true },
    amount: { type: 'number', required: true },
    status: {
      type: 'string',
      isIn: ['unpaid', 'paid'],
      defaultsTo: 'unpaid',
    },
    paidTransRefId: { type: 'string', allowNull: true },
  },
};
