export const INITIAL_SERVICE = {
  code: '',
  name: '',
  authMethod: 'none',
  feeType: 'fixed',
  feeValue: 0,
  feeMax: Number.MAX_SAFE_INTEGER,
  feeMin: 0,
  status: true,
};

export const INITIAL_TRANS_FIELD = {
  order: 1,
  name: '',
  code: '',
  dataType: 'string',
  isRequired: true,
  minLength: '',
  maxLength: '',
  regex: '',
  error: '',
};

export const INITIAL_FIELD_BUILDER = {
  order: 1,
  code: '',
  name: '',
  dataType: 'string',
  rule: 'fixed',
  isRequired: true,
  value: '',
  source: 'body',
  sourceField: '',
  query: '',
  queryField: [],
  column: [],
  error: '',
};

export const INITIAL_SERVICE_CREATE_FIELD_BUILDER = {
  order: 1,
  code: '',
  name: '',
  dataType: 'string',
  rule: 'fixed',
  isRequired: true,
  value: '',
  source: 'body',
  sourceField: '',
  query: '',
  queryFields: '',
  columns: '',
  error: '',
};

export const INITIAL_SERVICE_CREATE_FORM = {
  code: '',
  name: '',
  authMethod: 'pin',
  feeType: 'fixed',
  feeValue: 0,
  feeMax: Number.MAX_SAFE_INTEGER,
  feeMin: 0,
  status: true,
  validations: [],
  transFields: [],
  fieldBuilders: [],
  definition: { glSteps: [] },
};
