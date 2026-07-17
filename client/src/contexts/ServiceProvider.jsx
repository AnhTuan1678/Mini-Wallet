import { useState } from 'react';
import {
  INITIAL_FIELD_BUILDER,
  INITIAL_SERVICE,
  INITIAL_TRANS_FIELD,
} from '../constants/serviceDefaults';
import ServiceContext from './ServiceContext';

const reorder = (list) =>
  list.map((item, index) => ({
    ...item,
    order: index + 1,
  }));

export default function ServiceProvider({ children, initialState = null }) {
  const [loading, setLoading] = useState(false);

  const [service, setService] = useState(
    initialState?.service || INITIAL_SERVICE
  );
  const [transField, setTransField] = useState(initialState?.transField || []);
  const [fieldBuilder, setFieldBuilder] = useState(
    initialState?.fieldBuilder || []
  );
  const [transValidation, setTransValidation] = useState(
    initialState?.transValidation || []
  );

  const changeService = (key, value) => {
    setService((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadService = (data) => {
    setService(data);
    setFieldBuilder(data.fieldBuilders || []);
    setTransField(data.transFields || []);
    setTransValidation(data.validations || []);
  };

  const reset = () => {
    setService(INITIAL_SERVICE);
    console.log('reset service', INITIAL_SERVICE);
    setFieldBuilder([]);
    setTransField([]);
    setTransValidation([]);
  };

  // ===========================
  // TransField
  // ===========================

  const addTransField = () => {
    setTransField((prev) => [
      ...prev,
      {
        ...INITIAL_TRANS_FIELD,
        order: prev.length + 1,
      },
    ]);
  };

  const handleTransFieldChange = (index, field, value) => {
    setTransField((prev) => {
      const list = [...prev];
      list[index] = {
        ...list[index],
        [field]: value,
      };
      return list;
    });
  };

  const removeTransField = (index) => {
    setTransField((prev) => reorder(prev.filter((_, i) => i !== index)));
  };

  // ===========================
  // FieldBuilder
  // ===========================

  const addFieldBuilder = () => {
    setFieldBuilder((prev) => [
      ...prev,
      {
        ...INITIAL_FIELD_BUILDER,
        order: prev.length + 1,
      },
    ]);
  };

  const handleFieldBuilderChange = (index, field, value) => {
    setFieldBuilder((prev) => {
      const list = [...prev];
      list[index] = {
        ...list[index],
        [field]: value,
      };
      return list;
    });
  };

  const removeFieldBuilder = (index) => {
    setFieldBuilder((prev) => reorder(prev.filter((_, i) => i !== index)));
  };

  // ===========================
  // Validation
  // ===========================

  const addTransValidation = (validation) => {
    setTransValidation((prev) => [
      ...prev,
      {
        ...validation,
        order: prev.length + 1,
      },
    ]);
  };

  const removeTransValidation = (index) => {
    setTransValidation((prev) => reorder(prev.filter((_, i) => i !== index)));
  };

  const handleValidationToggle = (validationRule) => {
    setTransValidation((prev) => {
      const exists = prev.some(
        (item) => item.validateFunc === validationRule.validateFunc
      );

      if (exists) {
        return reorder(
          prev.filter(
            (item) => item.validateFunc !== validationRule.validateFunc
          )
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

  return (
    <ServiceContext.Provider
      value={{
        loading,
        setLoading,

        service,
        transField,
        fieldBuilder,
        transValidation,

        setService,
        setTransField,
        setFieldBuilder,
        setTransValidation,

        loadService,
        reset,
        changeService,

        addTransField,
        handleTransFieldChange,
        removeTransField,

        addFieldBuilder,
        handleFieldBuilderChange,
        removeFieldBuilder,

        addTransValidation,
        removeTransValidation,
        handleValidationToggle,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
