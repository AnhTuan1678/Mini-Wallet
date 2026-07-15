module.exports = {
  me: async (req, res) => {
    const customerId = req.user.id;
    const pocket = await PocketService.findByOwner(customerId);

    return res.ok(_.omit(pocket, ['owner']));
  },

  find: async (req, res) => {
    const { customerId } = req.body;
    const pocket = await PocketService.find(customerId);

    return res.ok(_.omit(pocket, ['owner', 'checksum']));
  },

  getAll: async (req, res) => {
    try {
      const wallets = await PocketService.getAll();

      return res.ok({
        message: 'Thành công',
        data: wallets,
      });
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const { pocketId } = req.body;
      const transactions = await PocketService.getTransactions(pocketId);

      return res.ok({
        message: 'Thành công',
        data: transactions,
      });
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },
};
