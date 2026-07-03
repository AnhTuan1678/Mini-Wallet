module.exports = {
  me: async (req, res) => {
    const customerId = req.user.id;
    const pocket = PocketService.find(customerId);

    return res.ok(_.omit(pocket, ['owner']));
  },

  find: async (req, res) => {
    const { customerId } = req.body;
    const pocket = PocketService.find(customerId);

    return res.ok(_.omit(pocket, ['owner']));
  },
  // getTransaction: async (req, res) => {},
  // getBalance: async (req, res) => {},
};
