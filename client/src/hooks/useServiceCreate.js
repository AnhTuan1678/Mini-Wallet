import { useState } from 'react';
import { createServiceAPI } from '../services/serviceApi';

// Predefined validation rules
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

const initialFormData = {
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
  queryFields: '',
  columns: '',
  error: '',
};

const useServiceCreate = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedValidations, setSelectedValidations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleValidationToggle = (validationRule) => {
    setSelectedValidations((prev) => {
      const isSelected = prev.includes(validationRule.id);
      let newSelected;

      if (isSelected) {
        newSelected = prev.filter((id) => id !== validationRule.id);
        // Remove from validations array
        setFormData((prevData) => ({
          ...prevData,
          validations: prevData.validations.filter(
            (v) => v.validateFunc !== validationRule.func
          ),
        }));
      } else {
        newSelected = [...prev, validationRule.id];
        // Add to validations array
        setFormData((prevData) => ({
          ...prevData,
          validations: [
            ...prevData.validations,
            {
              order: prevData.validations.length + 1,
              validateFunc: validationRule.func,
              validateFields: validationRule.fields,
            },
          ],
        }));
      }

      return newSelected;
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTransFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const newTransFields = [...prev.transFields];
      newTransFields[index] = { ...newTransFields[index], [field]: value };
      return { ...prev, transFields: newTransFields };
    });
  };

  const addTransField = () => {
    setFormData((prev) => ({
      ...prev,
      transFields: [
        ...prev.transFields,
        {
          ...initialTransField,
          order: prev.transFields.length + 1,
        },
      ],
    }));
  };

  const removeTransField = (index) => {
    setFormData((prev) => ({
      ...prev,
      transFields: prev.transFields.filter((_, i) => i !== index),
    }));
  };

  const handleFieldBuilderChange = (index, field, value) => {
    setFormData((prev) => {
      const newFieldBuilders = [...prev.fieldBuilders];
      newFieldBuilders[index] = { ...newFieldBuilders[index], [field]: value };
      return { ...prev, fieldBuilders: newFieldBuilders };
    });
  };

  const addFieldBuilder = () => {
    setFormData((prev) => ({
      ...prev,
      fieldBuilders: [
        ...prev.fieldBuilders,
        {
          ...initialFieldBuilder,
          order: prev.fieldBuilders.length + 1,
        },
      ],
    }));
  };

  const removeFieldBuilder = (index) => {
    setFormData((prev) => ({
      ...prev,
      fieldBuilders: prev.fieldBuilders.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await createServiceAPI(formData);
      setSuccess(true);
      // Reset form
      setFormData(initialFormData);
      setSelectedValidations([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedValidations([]);
    setError(null);
    setSuccess(false);
  };

  return {
    formData,
    selectedValidations,
    error,
    success,
    handleChange,
    handleValidationToggle,
    handleTransFieldChange,
    addTransField,
    removeTransField,
    handleFieldBuilderChange,
    addFieldBuilder,
    removeFieldBuilder,
    handleSubmit,
    resetForm,
  };
};

export default useServiceCreate;
