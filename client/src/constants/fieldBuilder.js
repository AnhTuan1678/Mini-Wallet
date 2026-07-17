// constants/fieldBuilder.js

export const FIELD_BUILDER_RULES = [
  {
    value: 'mapping',
    label: 'Mapping',
  },
  {
    value: 'fixed',
    label: 'Fixed',
  },
  {
    value: 'query',
    label: 'Query',
  },
];

export const DATA_TYPES = [
  {
    value: 'string',
    label: 'String',
  },
  {
    value: 'number',
    label: 'Number',
  },
  {
    value: 'boolean',
    label: 'Boolean',
  },
  {
    value: 'date',
    label: 'Date',
  },
];

export const QUERY_OPTIONS = [
  {
    value: 'queryUserById',
    label: 'User theo ID',
    inputs: ['senderId'],
    outputs: ['id', 'name', 'phone', 'role', 'email'],
  },
  {
    value: 'queryUserByPhone',
    label: 'User theo SĐT',
    inputs: ['receiverPhone'],
    outputs: ['id', 'name', 'phone', 'role', 'email'],
  },
  {
    value: 'queryPocketByUserId',
    label: 'Pocket theo User id',
    inputs: ['senderId'],
    outputs: ['id', 'balance', 'type', 'owner'],
  },
  {
    value: 'queryPocketByPhone',
    label: 'Pocket theo Phone',
    inputs: ['receiverPhone'],
    outputs: ['id', 'balance', 'type', 'owner'],
  },
  {
    value: 'querySystemPocket',
    label: 'Ví hệ thống',
    inputs: [],
    outputs: ['id', 'balance', 'type', 'owner'],
  },
  {
    value: 'queryBankPocket',
    label: 'Ví ngân hàng',
    inputs: [],
    outputs: ['id', 'balance', 'type', 'owner'],
  },
  {
    value: 'queryBillerPocketById',
    label: 'Ví Biller theo ID',
    inputs: ['billerId'],
    outputs: ['id', 'balance', 'type', 'owner'],
  }
];

export const AVAILABLE_FIELDS = [
  {
    code: 'senderId',
    name: 'ID người gửi',
  },
];

export const getAvailableFields = (transFields = []) => {
  const dynamicFields = (transFields || [])
    .filter((field) => field?.code)
    .map((field) => ({
      code: field.code,
      name: field.name || field.code,
    }));

  const seen = new Set();

  return [...AVAILABLE_FIELDS, ...dynamicFields].filter((field) => {
    if (seen.has(field.code)) {
      return false;
    }

    seen.add(field.code);
    return true;
  });
};
