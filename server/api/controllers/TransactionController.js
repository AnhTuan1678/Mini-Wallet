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
    const result = await TransactionService.history(req.user);

    return res.ok(result);
  },
};
