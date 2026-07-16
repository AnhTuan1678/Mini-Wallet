import { useState } from 'react';
import {
  INITIAL_FIELD_BUILDER,
  INITIAL_SERVICE,
  INITIAL_TRANS_FIELD,
} from '../constants/serviceDefaults';

export default function useService() {
  const [service, setService] = useState(INITIAL_SERVICE);
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
      { ...INITIAL_TRANS_FIELD, order: transField.length + 1 },
    ]);
  };

  const addFieldBuilder = () => {
    setFieldBuilder([
      ...fieldBuilder,
      { ...INITIAL_FIELD_BUILDER, order: fieldBuilder.length + 1 },
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
  console.log(service, fieldBuilder, transField, transValidation);

  const handleFieldBuilderChange = (index, field, value) => {
    console.log('handleFieldBuilderChange', index, field, value);
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
