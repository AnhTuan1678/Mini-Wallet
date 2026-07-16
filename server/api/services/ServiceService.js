const filterRequiredFields = (service) => ({
  id: service.id,
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
  transFields: service.transFields,
  validations: service.validations,
  transValidations: service.transValidations,
});

const validateServiceConfig = (serviceData) => {
  const errors = [];

  // Validate required fields
  if (!serviceData.code || typeof serviceData.code !== 'string') {
    errors.push('code is required and must be a string');
  }

  if (!serviceData.name || typeof serviceData.name !== 'string') {
    errors.push('name is required and must be a string');
  }

  // Validate authMethod
  if (
    serviceData.authMethod &&
    !['pin', 'none', 'otp'].includes(serviceData.authMethod)
  ) {
    errors.push('authMethod must be one of: pin, none, otp');
  }

  // Validate feeType
  if (
    serviceData.feeType &&
    !['fixed', 'percent'].includes(serviceData.feeType)
  ) {
    errors.push('feeType must be one of: fixed, percent');
  }

  // Validate feeValue
  if (
    serviceData.feeValue !== undefined &&
    (typeof serviceData.feeValue !== 'number' || serviceData.feeValue < 0)
  ) {
    errors.push('feeValue must be a non-negative number');
  }

  // Validate feeMax
  if (
    serviceData.feeMax !== undefined &&
    (typeof serviceData.feeMax !== 'number' || serviceData.feeMax < 0)
  ) {
    errors.push('feeMax must be a non-negative number');
  }

  // Validate feeMin
  if (
    serviceData.feeMin !== undefined &&
    (typeof serviceData.feeMin !== 'number' || serviceData.feeMin < 0)
  ) {
    errors.push('feeMin must be a non-negative number');
  }

  // Validate fee consistency
  if (
    serviceData.feeMin !== undefined &&
    serviceData.feeMax !== undefined &&
    serviceData.feeMin > serviceData.feeMax
  ) {
    errors.push('feeMin cannot be greater than feeMax');
  }

  // Validate status
  if (
    serviceData.status !== undefined &&
    typeof serviceData.status !== 'boolean'
  ) {
    errors.push('status must be a boolean');
  }

  // Validate validations array
  if (serviceData.validations !== undefined) {
    if (!Array.isArray(serviceData.validations)) {
      errors.push('validations must be an array');
    } else {
      serviceData.validations.forEach((validation, index) => {
        if (!validation.order || typeof validation.order !== 'number') {
          errors.push(
            `validations[${index}].order is required and must be a number`
          );
        }

        if (
          !validation.validateFunc ||
          typeof validation.validateFunc !== 'string'
        ) {
          errors.push(
            `validations[${index}].validateFunc is required and must be a string`
          );
        }

        if (
          !validation.validateFields ||
          typeof validation.validateFields !== 'string'
        ) {
          errors.push(
            `validations[${index}].validateFields is required and must be a string`
          );
        }
      });
    }
  }

  // Validate transFields array

  if (serviceData.transFields !== undefined) {
    if (!Array.isArray(serviceData.transFields)) {
      errors.push('transFields must be an array');
    } else {
      serviceData.transFields.forEach((field, index) => {
        if (!field.order || typeof field.order !== 'number') {
          errors.push(
            `transFields[${index}].order is required and must be a number`
          );
        }

        if (!field.code || typeof field.code !== 'string') {
          errors.push(
            `transFields[${index}].code is required and must be a string`
          );
        }

        if (
          !field.dataType ||
          !['string', 'number', 'boolean', 'date'].includes(field.dataType)
        ) {
          errors.push(
            `transFields[${index}].dataType must be one of: string, number, boolean, date`
          );
        }
      });
    }
  }

  // Validate fieldBuilders array

  if (serviceData.fieldBuilders !== undefined) {
    if (!Array.isArray(serviceData.fieldBuilders)) {
      errors.push('fieldBuilders must be an array');
    } else {
      serviceData.fieldBuilders.forEach((builder, index) => {
        if (!builder.order || typeof builder.order !== 'number') {
          errors.push(
            `fieldBuilders[${index}].order is required and must be a number`
          );
        }

        if (!builder.code || typeof builder.code !== 'string') {
          errors.push(
            `fieldBuilders[${index}].code is required and must be a string`
          );
        }

        if (!builder.name || typeof builder.name !== 'string') {
          errors.push(
            `fieldBuilders[${index}].name is required and must be a string`
          );
        }

        if (
          !builder.dataType ||
          !['string', 'number', 'boolean', 'date', 'object', 'array'].includes(
            builder.dataType
          )
        ) {
          errors.push(
            `fieldBuilders[${index}].dataType must be one of: string, number, boolean, date, object, array`
          );
        }

        if (
          !builder.rule ||
          !['fixed', 'mapping', 'query'].includes(builder.rule)
        ) {
          errors.push(
            `fieldBuilders[${index}].rule must be one of: fixed, mapping, query`
          );
        }
      });
    }
  }

  // Validate definition

  if (serviceData.definition !== undefined) {
    if (
      !serviceData.definition.glSteps ||
      !Array.isArray(serviceData.definition.glSteps)
    ) {
      errors.push('definition.glSteps must be an array');
    }
  }

  return errors;
};

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

    // Create definition if provided
    if (definition) {
      await TransDefinition.create({
        ...definition,
        service: service.id,
      });
    }

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

    if (definition) {
      await TransDefinition.create({
        ...definition,
        service: id,
      });
    }

    const updatedService = await Service.findOne({ id })
      .populate('validations')
      .populate('transFields')
      .populate('fieldBuilders')
      .populate('definition');

    return updatedService;
  },
};
