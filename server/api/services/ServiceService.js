const { validateServiceConfig } = require('./serviceConfigUtils');
const buildDefaultGlSteps = require('./buildDefaultGlSteps');

module.exports = {
  async getByCode(code) {
    const service = await Service.findOne({ code }).populate('fieldBuilders');

    if (!service) {
      throw new Error('Service not found');
    }

    // return filterRequiredFields(service);
    return service;
  },

  async getAll() {
    const services = await Service.find()
      .populate('fieldBuilders')
      .populate('transFields')
      .populate('validations');

    // return services.map(filterRequiredFields);
    return services;
  },

  async create(serviceData) {
    // Validate service config before creating
    const validationErrors = validateServiceConfig(serviceData);

    if (validationErrors.length > 0) {
      const error = new Error('Service configuration validation failed');
      error.validationErrors = validationErrors;
      throw error;
    }

    // Check if service code already exists
    const existingService = await Service.findOne({ code: serviceData.code });

    if (existingService) {
      throw new Error('Service with this code already exists');
    }

    // Extract nested data
    const {
      validations,
      transFields,
      fieldBuilders,
      definition,
      ...serviceFields
    } = serviceData;

    // Create the service
    const service = await Service.create(serviceFields).fetch();

    // Create validations if provided
    if (validations && validations.length > 0) {
      await Promise.all(
        validations.map((validation) =>
          TransValidation.create({
            ...validation,
            service: service.id,
          })
        )
      );
    }

    // Create transFields if provided
    if (transFields && transFields.length > 0) {
      await Promise.all(
        transFields.map((field) =>
          TransField.create({
            ...field,
            service: service.id,
          })
        )
      );
    }

    // Create fieldBuilders if provided
    if (fieldBuilders && fieldBuilders.length > 0) {
      await Promise.all(
        fieldBuilders.map((builder) =>
          FieldBuilder.create({
            ...builder,
            service: service.id,
          })
        )
      );
    }

    // Create definition - auto-generate glSteps if not provided
    const glSteps =
      definition && definition.glSteps && definition.glSteps.length > 0
        ? definition.glSteps
        : buildDefaultGlSteps(serviceFields.type, serviceFields.feeValue);

    await TransDefinition.create({
      service: service.id,
      glSteps,
    });

    // Return the service with populated data
    const createdService = await Service.findOne({ id: service.id })
      .populate('validations')
      .populate('transFields')
      .populate('fieldBuilders')
      .populate('definition');

    return createdService;
  },

  async update(serviceData) {
    const validationErrors = validateServiceConfig(serviceData);

    if (validationErrors.length > 0) {
      const error = new Error('Service configuration validation failed');
      error.validationErrors = validationErrors;
      throw error;
    }

    if (!serviceData.id) {
      throw new Error('Service id is required');
    }

    const existingService = await Service.findOne({ id: serviceData.id });

    if (!existingService) {
      throw new Error('Service not found');
    }

    const {
      id,
      validations,
      transFields,
      fieldBuilders,
      definition,
      ...serviceFields
    } = serviceData;

    await Service.updateOne({ id }).set(serviceFields);

    await TransValidation.destroy({ service: id });
    await TransField.destroy({ service: id });
    await FieldBuilder.destroy({ service: id });
    await TransDefinition.destroy({ service: id });

    if (validations && validations.length > 0) {
      await Promise.all(
        validations.map((validation) =>
          TransValidation.create({
            ...validation,
            service: id,
          })
        )
      );
    }

    if (transFields && transFields.length > 0) {
      await Promise.all(
        transFields.map((field) =>
          TransField.create({
            ...field,
            service: id,
          })
        )
      );
    }

    if (fieldBuilders && fieldBuilders.length > 0) {
      await Promise.all(
        fieldBuilders.map((builder) =>
          FieldBuilder.create({
            ...builder,
            service: id,
          })
        )
      );
    }

    // Auto-generate glSteps if not provided
    const resolvedType = serviceFields.type || existingService.type;
    const resolvedFeeValue = serviceFields.feeValue !== undefined
      ? serviceFields.feeValue
      : existingService.feeValue;
    const glSteps =
      definition && definition.glSteps && definition.glSteps.length > 0
        ? definition.glSteps
        : buildDefaultGlSteps(resolvedType, resolvedFeeValue);

    await TransDefinition.create({
      service: id,
      glSteps,
    });

    const updatedService = await Service.findOne({ id })
      .populate('validations')
      .populate('transFields')
      .populate('fieldBuilders')
      .populate('definition');

    return updatedService;
  },
};
