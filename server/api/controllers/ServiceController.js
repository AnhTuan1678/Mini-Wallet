module.exports = {
  async getByCode(req, res) {
    try {
      const service = await ServiceService.getByCode(req.body.code);

      return res.ok(service);
    } catch (err) {
      return res.serverError(err);
    }
  },

  async getAll(req, res) {
    try {
      const services = await ServiceService.getAll();

      return res.ok({ services });
    } catch (err) {
      return res.serverError(err);
    }
  },
};
