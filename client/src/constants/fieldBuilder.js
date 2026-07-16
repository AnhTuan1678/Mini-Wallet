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
    outputs: ['id', 'name', 'phone', 'role'],
  },
  {
    value: 'queryUserByPhone',
    label: 'User theo SĐT',
    inputs: ['receiverPhone'],
    outputs: ['id', 'name', 'phone', 'role'],
  },
  {
    value: 'queryPocketByUserId',
    label: 'Pocket theo User id',
    inputs: ['senderId'],
    outputs: ['id', 'balance'],
  },
  {
    value: 'queryPocketByPhone',
    label: 'Pocket theo Phone',
    inputs: ['receiverPhone'],
    outputs: ['id', 'balance'],
  },
];

export const AVAILABLE_FIELDS = [
  {
    code: 'senderId',
    name: 'ID người gửi',
  },
  {
    code: 'receiverPhone',
    name: 'Số ĐT người nhận',
  },
  {
    code: 'amount',
    name: 'Số tiền',
  },
];
