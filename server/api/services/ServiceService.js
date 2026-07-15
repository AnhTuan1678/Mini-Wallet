const filterRequiredFields = (service) => ({
  code: service.code,
  name: service.name,
  authMethod: service.authMethod,
  feeType: service.feeType,
  feeValue: service.feeValue,
  fieldBuilders: service.fieldBuilders
    .filter((field) => field.isRequired)
    .map((field) => ({
      order: field.order,
      name: field.name,
      dataType: field.dataType,
      code: field.code,
    })),
});

module.exports = {
  async getByCode(code) {
    const service = await Service.findOne({ code }).populate('fieldBuilders');

    if (!service) {
      throw new Error('Service not found');
    }

    return filterRequiredFields(service);
  },

  async getAll() {
    const services = await Service.find().populate('fieldBuilders');

    return services.map(filterRequiredFields);
  },
};
