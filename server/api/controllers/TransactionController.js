module.exports = {
  request: async function (req, res) {
    try {
      const result = await TransactionService.request(req.body, req.user);

      return res.ok(result);
    } catch (error) {
      console.error('Error in request transaction:', error);

      return res.badRequest({message: error.message || 'Lỗi máy chủ'});
    }
  },

  confirm: async function (req, res) {
    try {
      const result = await TransactionService.confirm(req.body, req.user);

      return res.ok(result);
    } catch (error) {
      console.error('Error in confirm transaction:', error);

      return res.badRequest({message: error.message || 'Lỗi máy chủ'});
    }
  },

  verify: async function (req, res) {
    try {
      const result = await TransactionService.verify(req.body, req.user);

      return res.ok(result);
    } catch (error) {
      console.error('Error in verify transaction:', error);

      return res.badRequest({message: error.message || 'Lỗi máy chủ'});
    }
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
