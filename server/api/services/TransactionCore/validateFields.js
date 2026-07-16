module.exports = async ({ service, transBody }) => {
  const fields = await TransField.find({
    service: service.id,
    status: true,
  }).sort('order ASC');

  for (const field of fields) {
    const value = transBody[field.code];

    // Required
    if (
      field.isRequired &&
      (value === undefined || value === null || value === '')
    ) {
      throw new Error(`'${field.code}' không được phép thiếu`);
    }

    // Không required và không có dữ liệu thì bỏ qua
    if (value === undefined || value === null) {
      continue;
    }

    // Data type
    switch (field.dataType) {
      case 'string':
        if (typeof value !== 'string') {
          throw new Error(`'${field.code}' phải là chuỗi`);
        }

        break;

      case 'number':
        if (typeof value !== 'number') {
          throw new Error(`'${field.code}' phải là số`);
        }

        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`'${field.code}' phải là boolean`);
        }

        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          throw new Error(`'${field.code}' phải là object`);
        }

        break;

      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`'${field.code}' phải là mảng`);
        }

        break;
    }

    // Min length
    if (field.minLength && String(value).length < field.minLength) {
      throw new Error(
        `'${field.code}' có độ dài tối thiểu là ${field.minLength}`
      );
    }

    // Max length
    if (field.maxLength && String(value).length > field.maxLength) {
      throw new Error(`'${field.code}' có độ dài tối đa là ${field.maxLength}`);
    }

    // Regex
    if (field.regex) {
      const regex = new RegExp(field.regex);

      if (!regex.test(String(value))) {
        throw new Error(`'${field.code}' không hợp lệ`);
      }
    }
  }
};
