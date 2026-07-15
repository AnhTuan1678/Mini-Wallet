module.exports = {
  request: async function (req, res) {
    const result = await TransactionService.request(req.body, req.user);

    return res.ok(result);
  },

  confirm: async function (req, res) {
    const result = await TransactionService.confirm(req.body, req.user);

    return res.ok(result);
  },

  verify: async function (req, res) {
    const result = await TransactionService.verify(req.body, req.user);

    return res.ok(result);
  },

  history: async function (req, res) {
    const filters = {
      status: req.body.status,
      transRefId: req.body.transRefId,
      minAmount: req.body.minAmount,
      maxAmount: req.body.maxAmount,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      sortField: req.body.sortField,
      sortOrder: req.body.sortOrder,
    };

    const result = await TransactionService.history(req.user, filters);

    return res.ok(result);
  },
};
