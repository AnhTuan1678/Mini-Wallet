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
  // getTransaction: async (req, res) => {},
  // getBalance: async (req, res) => {},
};
