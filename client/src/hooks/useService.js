import { useState } from 'react';

export const PREDEFINED_VALIDATIONS = [
  {
    id: 'verifyPIN',
    name: 'Xác thực PIN',
    func: 'verifyPINAsync',
    fields: 'pin',
  },
  {
    id: 'validateBalance',
    name: 'Kiểm tra số dư',
    func: 'validateBalance',
    fields: 'amount',
  },
  {
    id: 'validateAmount',
    name: 'Kiểm tra số tiền',
    func: 'validateAmount',
    fields: 'amount',
  },
  {
    id: 'validateReceiver',
    name: 'Kiểm tra người nhận',
    func: 'validateReceiver',
    fields: 'receiver',
  },
  {
    id: 'validateDailyLimit',
    name: 'Kiểm tra giới hạn ngày',
    func: 'validateDailyLimit',
    fields: 'amount',
  },
  {
    id: 'validateMonthlyLimit',
    name: 'Kiểm tra giới hạn tháng',
    func: 'validateMonthlyLimit',
    fields: 'amount',
  },
];

const initialService = {
  code: '',
  name: '',
  authMethod: 'none',
  feeType: 'fixed',
  feeValue: 0,
  feeMax: Number.MAX_SAFE_INTEGER,
  feeMin: 0,
  status: true,
};

const initialTransField = {
  order: 1,
  fieldName: '',
  dataType: 'string',
  isRequired: true,
  minLength: '',
  maxLength: '',
  regex: '',
  errorCode: '',
};

const initialFieldBuilder = {
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
  queryField: '',
  column: '',
  error: '',
};

export default function useService() {
  const [service, setService] = useState(initialService);
  const [loading, setLoading] = useState(false);
  const [transField, setTransField] = useState([]);
  const [fieldBuilder, setFieldBuilder] = useState([]);
  const [transValidation, setTransValidation] = useState([]);

  const changeService = (key, value) => {
    setService({ ...service, [key]: value });
  };

  const addTransField = () => {
    setTransField([
      ...transField,
      { ...initialTransField, order: transField.length + 1 },
    ]);
  };

  const addFieldBuilder = () => {
    setFieldBuilder([
      ...fieldBuilder,
      { ...initialFieldBuilder, order: fieldBuilder.length + 1 },
    ]);
  };

  const addTransValidation = (validation) => {
    setTransValidation([...transValidation, validation]);
  };

  const removeFieldBuilder = (index) => {
    setFieldBuilder(fieldBuilder.filter((_, i) => i !== index));
  };

  const removeTransValidation = (index) => {
    setTransValidation(transValidation.filter((_, i) => i !== index));
  };

  const handleValidationToggle = (validationRule) => {
    setTransValidation((prev) => {
      const exists = prev.some(
        (item) => item.validateFunc === validationRule.validateFunc
      );

      if (exists) {
        return prev.filter(
          (item) => item.validateFunc !== validationRule.validateFunc
        );
      }

      return [
        ...prev,
        {
          order: prev.length + 1,
          validateFunc: validationRule.validateFunc,
          validateFields: validationRule.validateFields,
          errorCode: validationRule.errorCode,
          status: true,
        },
      ];
    });
  };

  const handleTransFieldChange = (index, field, value) => {
    setTransField((prev) => {
      const newTransFields = [...prev];
      newTransFields[index] = { ...newTransFields[index], [field]: value };
      return newTransFields;
    });
  };

  const removeTransField = (index) => {
    setTransField(transField.filter((_, i) => i !== index));
  };

  const handleFieldBuilderChange = (index, field, value) => {
    setFieldBuilder((prev) => {
      const newFieldBuilders = [...prev];
      newFieldBuilders[index] = { ...newFieldBuilders[index], [field]: value };
      return newFieldBuilders;
    });
  };

  return {
    service,
    setService,
    loading,
    setLoading,
    transField,
    setTransField,
    fieldBuilder,
    setFieldBuilder,
    transValidation,
    setTransValidation,
    addTransField,
    addFieldBuilder,
    addTransValidation,
    removeFieldBuilder,
    removeTransValidation,
    changeService,
    handleValidationToggle,
    handleTransFieldChange,
    removeTransField,
    handleFieldBuilderChange,
  };
}
