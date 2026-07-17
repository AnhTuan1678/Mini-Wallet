import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  requestTransactionAPI,
  confirmTransactionAPI,
  verifyTransactionAPI,
} from '../services/transactionApi';
import useAuth from '../contexts/useAuth';

const buildRequestData = (service) => {
  if (!service?.fieldBuilders) return {};

  return service.fieldBuilders.reduce((acc, field) => {
    acc[field.code] = '';
    return acc;
  }, {});
};

export default function useTransfer(service) {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transRefId, setTransRefId] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [pin, setPin] = useState('');
  const [requestData, setRequestData] = useState(() =>
    buildRequestData(service)
  );

  const { token } = useAuth();

  const onBack = useCallback(() => {
    navigate('/transactions-history');
  }, [navigate]);

  const handleRequestChange = useCallback((e) => {
    const { name, value } = e.target;

    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');

    if (value.length <= 6) {
      setPin(value);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const body = {
        serviceCode: service.code,
      };

      service.transFields.forEach((field) => {
        let value = requestData[field.code];

        if (field.dataType === 'number') {
          value = Number(value);
        }

        body[field.code] = value;
      });

      const result = await requestTransactionAPI(body, token);

      setTransRefId(result.transRefId);
      setPreviewData(result);

      const amount = result.amount || 0;
      const fee = result.fee || 0;

      setSuccess(
        `Yêu cầu chuyển ${amount.toLocaleString()} MMK thành công! Phí: ${fee.toLocaleString()} MMK`
      );

      setTimeout(() => {
        setSuccess('');
        setActiveStep(1);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Yêu cầu giao dịch thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const confirmResult = await confirmTransactionAPI(transRefId, token);

      if (confirmResult?.authMethod === 'none') {
        await verifyTransactionAPI(
          {
            transRefId,
            pin: '',
          },
          token
        );

        setSuccess('Chuyển tiền thành công!');

        setTimeout(() => {
          onBack();
        }, 2000);

        return;
      }

      setSuccess('Xác nhận thành công!');

      setTimeout(() => {
        setSuccess('');
        setActiveStep(2);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Xác nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await verifyTransactionAPI(
        {
          transRefId,
          pin,
        },
        token
      );

      setSuccess('Chuyển tiền thành công!');

      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Xác thực PIN thất bại');
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStep,
    loading,
    error,
    success,
    requestData,
    previewData,
    pin,

    handleRequestChange,
    handlePinChange,

    handleRequestSubmit,
    handleConfirmSubmit,
    handleVerifySubmit,
  };
}
