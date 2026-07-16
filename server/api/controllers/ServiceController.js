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

  async create(req, res) {
    try {
      const service = await ServiceService.create(req.body);

      return res.created(service);
    } catch (err) {
      if (err.message === 'Service with this code already exists') {
        return res.conflict({ message: err.message });
      }

      if (err.message === 'Service configuration validation failed') {
        return res.badRequest({
          message: err.message,
          errors: err.validationErrors,
        });
      }

      return res.serverError(err);
    }
  },

  async update(req, res) {
    try {
      const service = await ServiceService.update(req.body);

      return res.ok(service);
    } catch (err) {
      if (err.message === 'Service not found') {
        return res.notFound({ message: err.message });
      }

      if (err.message === 'Service configuration validation failed') {
        return res.badRequest({
          message: err.message,
        });
      }

      return res.serverError(err);
    }
  },
};
