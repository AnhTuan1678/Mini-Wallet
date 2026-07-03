module.exports = {
  request: async function (req, res) {
    const result = await TransactionService.request(req.body, req.user);

    return res.json(result);
  },

  confirm: async function (req, res) {
    const result = await TransactionService.confirm(req.body, req.user);

    return res.json(result);
  },

  verify: async function (req, res) {
    const result = await TransactionService.verify(req.body, req.user);

    return res.json(result);
  },
};
