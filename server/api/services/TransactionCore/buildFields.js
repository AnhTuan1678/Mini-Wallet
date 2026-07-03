const query = {
  async queryUserByPhone(phone) {
    return await Customer.findOne({ phone });
  },

  async queryUserById(userId) {
    return await Customer.findOne({ id: userId });
  },

  async queryPocketByUserId(userId) {
    return await Pocket.findOne({ owner: userId });
  },

  async queryPocketByPhone(phone) {
    const customer = await this.queryUserByPhone(phone);

    if (!customer) {
      return null;
    }

    return await Pocket.findOne({ owner: customer.id });
  },
};

async function buildField(field, flatInput) {
  switch (field.rule) {
    case 'fixed':
      return field.value;

    case 'mapping':
      return flatInput[field.sourceField];

    case 'query':
      const args = field.queryFields.map((element) => flatInput[element]);

      const result = await query[field.query](...args);

      if (!field.columns || field.columns.length === 0) {
        return result;
      }

      const output = {};

      for (const column of field.columns) {
        output[column] = result[column];
      }

      return output;
    default:
      throw new Error(`Rule "${field.rule}" không hợp lệ`);
  }
}

function prefixKeys(obj, prefix) {
  const result = {};

  for (const key in obj) {
    result[`${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}`] = obj[key];
  }

  return result;
}

module.exports = async function ({ service, transInput }) {
  // Biến thành mảng phẳng
  const flatInput = {
    ...transInput.body,
    ...prefixKeys(transInput.user, 'sender'),
  };
  const fields =
    (await FieldBuilder.find({
      service: service.id,
    })) || [];
  fields.sort((a, b) => a.order - b.order);

  const result = {};

  for (const field of fields) {
    const value = await buildField(field, flatInput);

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, prefixKeys(value, field.name));
    } else {
      result[field.name] = value;
    }
  }

  return result;
};
