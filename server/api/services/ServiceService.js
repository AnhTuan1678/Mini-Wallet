const { validateServiceConfig } = require('./serviceConfigUtils');
const buildDefaultGlSteps = require('./buildDefaultGlSteps');

/**
 * Parse a numeric field: return the number if valid, else undefined.
 * Handles the case where the frontend sends '' (empty string) for optional number fields.
 */
function parseOptionalNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Sanitize a transField object before inserting into DB.
 * - Removes id (avoid conflict with existing records)
 * - Converts empty-string minLength/maxLength to undefined (omits from insert)
 */
function sanitizeTransField(field, serviceId) {
  const fieldToCreate = {
    order: field.order,
    code: field.code,
    name: field.name,
    dataType: field.dataType,
    isRequired: field.isRequired,
    regex: field.regex || undefined,
    errorCode: field.errorCode || undefined,
    status: field.status,
    service: serviceId,
  };

  const minLength = parseOptionalNumber(field.minLength);
  const maxLength = parseOptionalNumber(field.maxLength);

  if (minLength !== undefined) {
    fieldToCreate.minLength = minLength;
  }

  if (maxLength !== undefined) {
    fieldToCreate.maxLength = maxLength;
  }

  return fieldToCreate;
}

/**
 * Sanitize a fieldBuilder object before inserting into DB.
 * - Removes id, queryField (legacy), column (legacy), error (not in model)
 */
function sanitizeFieldBuilder(builder, serviceId) {
  return {
    order: builder.order,
    code: builder.code,
    name: builder.name,
    dataType: builder.dataType,
    rule: builder.rule,
    value: builder.value,
    source: builder.source || undefined,
    sourceField: builder.sourceField || undefined,
    query: builder.query || undefined,
    queryFields: builder.queryFields || undefined,
    columns: builder.columns || undefined,
    isRequired: builder.isRequired,
    service: serviceId,
  };
}

/**
 * Sanitize a validation object before inserting into DB.
 * - Removes id to avoid conflict with existing records
 */
function sanitizeValidation(validation, serviceId) {
  return {
    order: validation.order,
    validateFunc: validation.validateFunc,
    validateFields: validation.validateFields,
    errorCode: validation.errorCode || undefined,
    status: validation.status,
    service: serviceId,
  };
}

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

    // return services.map(filterRequiredFields);\
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
          TransValidation.create(sanitizeValidation(validation, service.id))
        )
      );
    }

    // Create transFields if provided
    if (transFields && transFields.length > 0) {
      await Promise.all(
        transFields.map((field) =>
          TransField.create(sanitizeTransField(field, service.id))
        )
      );
    }

    // Create fieldBuilders if provided
    if (fieldBuilders && fieldBuilders.length > 0) {
      await Promise.all(
        fieldBuilders.map((builder) =>
          FieldBuilder.create(sanitizeFieldBuilder(builder, service.id))
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
          TransValidation.create(sanitizeValidation(validation, id))
        )
      );
    }

    if (transFields && transFields.length > 0) {
      await Promise.all(
        transFields.map((field) =>
          TransField.create(sanitizeTransField(field, id))
        )
      );
    }

    if (fieldBuilders && fieldBuilders.length > 0) {
      await Promise.all(
        fieldBuilders.map((builder) =>
          FieldBuilder.create(sanitizeFieldBuilder(builder, id))
        )
      );
    }

    // Auto-generate glSteps if not provided
    const resolvedType = serviceFields.type || existingService.type;
    const resolvedFeeValue =
      serviceFields.feeValue !== undefined
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
