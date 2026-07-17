const buildFields = require('./TransactionCore/buildFields');
const validateTransaction = require('./TransactionCore/validateTransaction');

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

const SUPPORTED_VALIDATE_FUNCS = Object.keys(
  validateTransaction.validateFuncs || {}
);
const SUPPORTED_QUERY_FUNCTIONS = Object.keys(buildFields.queryFunctions || {});

const buildSupportedListMessage = (items) => items.join(', ');

const isValidRegex = (pattern) => {
  try {
    new RegExp(pattern);

    return true;
  } catch (unusedErr) {
    return false;
  }
};

const validateServiceConfig = (serviceData) => {
  const errors = [];
  // validateServiceConfig: kiểm tra cấu hình service trước khi lưu hoặc cập nhật
  // Mục tiêu là chặn config không hợp lệ, vì nếu lưu vào DB mà config sai thì dịch vụ sẽ không chạy được.

  // Kiểm tra cấu hình bắt buộc của dịch vụ
  // code và name phải tồn tại và là chuỗi
  if (!serviceData.code || typeof serviceData.code !== 'string') {
    errors.push('code is required and must be a string');
  }

  if (!serviceData.name || typeof serviceData.name !== 'string') {
    errors.push('name is required and must be a string');
  }

  // Kiểm tra phương thức xác thực: pin, none hoặc otp
  if (
    serviceData.authMethod &&
    !['pin', 'none', 'otp'].includes(serviceData.authMethod)
  ) {
    errors.push('authMethod must be one of: pin, none, otp');
  }

  // Kiểm tra loại dịch vụ hợp lệ
  if (
    serviceData.type &&
    !['transfer', 'cash-in', 'bill-payment', 'service'].includes(
      serviceData.type
    )
  ) {
    errors.push(
      'type must be one of: transfer, cash-in, bill-payment, service'
    );
  }

  // Ghi chú: type xác định luồng xử lý giao dịch, nên phải đúng với những gì backend hỗ trợ.
  // transfer: chuyển tiền, cash-in: nạp tiền, bill-payment: thanh toán hóa đơn, service: dịch vụ phụ trợ.

  // Kiểm tra action của dịch vụ, hiện chỉ hỗ trợ none hoặc billerTrans
  if (
    serviceData.action &&
    !['none', 'billerTrans'].includes(serviceData.action)
  ) {
    errors.push('action must be one of: none, billerTrans');
  }

  // Kiểm tra loại phí hợp lệ
  if (
    serviceData.feeType &&
    !['fixed', 'percent'].includes(serviceData.feeType)
  ) {
    errors.push('feeType must be one of: fixed, percent');
  }

  // Kiểm tra cấu hình phí: feeValue, feeMax, feeMin phải là số không âm
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

  const transFieldCodes = new Set();
  const fieldBuilderCodes = new Set();

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
        } else if (transFieldCodes.has(field.code)) {
          errors.push(`transFields[${index}].code must be unique`);
        } else {
          transFieldCodes.add(field.code);
        }

        if (
          !field.dataType ||
          !['string', 'number', 'boolean', 'date'].includes(field.dataType)
        ) {
          errors.push(
            `transFields[${index}].dataType must be one of: string, number, boolean, date`
          );
        }

        if (field.minLength !== undefined && field.minLength !== '') {
          if (typeof field.minLength !== 'number' || field.minLength < 0) {
            errors.push(
              `transFields[${index}].minLength must be a non-negative number or empty`
            );
          }
        }

        if (field.maxLength !== undefined && field.maxLength !== '') {
          if (typeof field.maxLength !== 'number' || field.maxLength < 0) {
            errors.push(
              `transFields[${index}].maxLength must be a non-negative number or empty`
            );
          }
        }

        if (
          field.minLength !== undefined &&
          field.minLength !== '' &&
          field.maxLength !== undefined &&
          field.maxLength !== '' &&
          field.minLength > field.maxLength
        ) {
          errors.push(
            `transFields[${index}].minLength cannot be greater than maxLength`
          );
        }

        if (field.regex && !isValidRegex(field.regex)) {
          errors.push(
            `transFields[${index}].regex is not a valid regular expression`
          );
        }
      });
    }
  }

  // Kiểm tra cấu hình transFields: mỗi trường phải có order, code, dataType hợp lệ

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
        } else if (fieldBuilderCodes.has(builder.code)) {
          errors.push(`fieldBuilders[${index}].code must be unique`);
        } else {
          fieldBuilderCodes.add(builder.code);
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

        if (builder.rule === 'fixed') {
          if (builder.value === undefined) {
            errors.push(
              `fieldBuilders[${index}].value is required for fixed rule`
            );
          }
        }

        // mapping: nguồn dữ liệu được lấy từ một field phẳng trong request
        if (builder.rule === 'mapping') {
          if (!builder.sourceField || typeof builder.sourceField !== 'string') {
            errors.push(
              `fieldBuilders[${index}].sourceField is required and must be a string for mapping rule`
            );
          }
        }

        if (builder.rule === 'query') {
          if (!builder.query || typeof builder.query !== 'string') {
            errors.push(
              `fieldBuilders[${index}].query is required and must be a string for query rule`
            );
          } else if (!SUPPORTED_QUERY_FUNCTIONS.includes(builder.query)) {
            errors.push(
              `fieldBuilders[${index}].query must be one of: ${buildSupportedListMessage(
                SUPPORTED_QUERY_FUNCTIONS
              )}`
            );
          }

          // query: trường này dùng hàm query để lấy dữ liệu từ DB dựa trên các trường khác
          if (!Array.isArray(builder.queryFields)) {
            errors.push(
              `fieldBuilders[${index}].queryFields is required and must be an array for query rule`
            );
          } else {
            builder.queryFields.forEach((fieldName, fieldIndex) => {
              if (typeof fieldName !== 'string') {
                errors.push(
                  `fieldBuilders[${index}].queryFields[${fieldIndex}] must be a string`
                );
              }
            });
          }

          if (
            builder.columns !== undefined &&
            !Array.isArray(builder.columns)
          ) {
            errors.push(
              `fieldBuilders[${index}].columns must be an array if provided`
            );
          }
        }
      });
    }
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

        // validations: mỗi rule validate phải có validateFunc và validateFields

        if (
          !validation.validateFunc ||
          typeof validation.validateFunc !== 'string'
        ) {
          errors.push(
            `validations[${index}].validateFunc is required and must be a string`
          );
        } else if (
          !SUPPORTED_VALIDATE_FUNCS.includes(validation.validateFunc)
        ) {
          errors.push(
            `validations[${index}].validateFunc must be one of: ${buildSupportedListMessage(
              SUPPORTED_VALIDATE_FUNCS
            )}`
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

  if (serviceData.definition !== undefined) {
    if (
      !serviceData.definition.glSteps ||
      !Array.isArray(serviceData.definition.glSteps)
    ) {
      errors.push('definition.glSteps must be an array');
    }
  }

  const hasAmountField =
    (serviceData.transFields || []).some((field) => field.code === 'amount') ||
    (serviceData.fieldBuilders || []).some(
      (builder) => builder.code === 'amount'
    );

  if (
    serviceData.type &&
    ['transfer', 'cash-in'].includes(serviceData.type) &&
    !hasAmountField
  ) {
    errors.push(
      'transfer and cash-in services must define an amount field in transFields or fieldBuilders'
    );
  }

  const hasBillerIdField =
    (serviceData.transFields || []).some(
      (field) => field.code === 'billerId'
    ) ||
    (serviceData.fieldBuilders || []).some(
      (builder) => builder.code === 'billerId'
    );
  const hasBillCodeField =
    (serviceData.transFields || []).some(
      (field) => field.code === 'billCode'
    ) ||
    (serviceData.fieldBuilders || []).some(
      (builder) => builder.code === 'billCode'
    );

  if (
    (serviceData.type === 'bill-payment' ||
      serviceData.action === 'billerTrans') &&
    (!hasBillerIdField || !hasBillCodeField)
  ) {
    errors.push(
      'bill-payment / billerTrans services must define billerId and billCode fields in transFields or fieldBuilders'
    );
  }

  return errors;
};

module.exports = {
  filterRequiredFields,
  validateServiceConfig,
};
