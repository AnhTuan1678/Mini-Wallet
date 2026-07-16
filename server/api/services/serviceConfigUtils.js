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

  if (!serviceData.code || typeof serviceData.code !== 'string') {
    errors.push('code is required and must be a string');
  }

  if (!serviceData.name || typeof serviceData.name !== 'string') {
    errors.push('name is required and must be a string');
  }

  if (
    serviceData.authMethod &&
    !['pin', 'none', 'otp'].includes(serviceData.authMethod)
  ) {
    errors.push('authMethod must be one of: pin, none, otp');
  }

  if (
    serviceData.feeType &&
    !['fixed', 'percent'].includes(serviceData.feeType)
  ) {
    errors.push('feeType must be one of: fixed, percent');
  }

  if (
    serviceData.feeValue !== undefined &&
    (typeof serviceData.feeValue !== 'number' || serviceData.feeValue < 0)
  ) {
    errors.push('feeValue must be a non-negative number');
  }

  if (
    serviceData.feeMax !== undefined &&
    (typeof serviceData.feeMax !== 'number' || serviceData.feeMax < 0)
  ) {
    errors.push('feeMax must be a non-negative number');
  }

  if (
    serviceData.feeMin !== undefined &&
    (typeof serviceData.feeMin !== 'number' || serviceData.feeMin < 0)
  ) {
    errors.push('feeMin must be a non-negative number');
  }

  if (
    serviceData.feeMin !== undefined &&
    serviceData.feeMax !== undefined &&
    serviceData.feeMin > serviceData.feeMax
  ) {
    errors.push('feeMin cannot be greater than feeMax');
  }

  if (
    serviceData.status !== undefined &&
    typeof serviceData.status !== 'boolean'
  ) {
    errors.push('status must be a boolean');
  }

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
  filterRequiredFields,
  validateServiceConfig,
};
