import { useState } from 'react';
import { createServiceAPI } from '../services/serviceApi';
import {
  INITIAL_SERVICE_CREATE_FORM,
  INITIAL_SERVICE_CREATE_FIELD_BUILDER,
  INITIAL_TRANS_FIELD,
} from '../constants/serviceDefaults';

const useServiceCreate = () => {
  const [formData, setFormData] = useState(INITIAL_SERVICE_CREATE_FORM);
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
          ...INITIAL_TRANS_FIELD,
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
          ...INITIAL_SERVICE_CREATE_FIELD_BUILDER,
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
      setFormData(INITIAL_SERVICE_CREATE_FORM);
      setSelectedValidations([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_SERVICE_CREATE_FORM);
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
