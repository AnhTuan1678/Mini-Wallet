import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  requestCashInAPI,
  confirmCashInAPI,
  verifyCashInAPI,
  getCashInServicesAPI,
} from '../services/cashInApi';
import useAuth from '../contexts/useAuth';

export const useCashIn = (serviceCode) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transRefId, setTransRefId] = useState('');
  const [requestData, setRequestData] = useState({
    receiverPhone: '',
    amount: '',
  });
  const [confirmData, setConfirmData] = useState(null);
  const [service, setService] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setServiceLoading(true);
        const services = await getCashInServicesAPI(token);
        const selectedService = services.find((s) => s.code === serviceCode);
        if (selectedService) {
          setService(selectedService);
        } else {
          setError('Không tìm thấy dịch vụ nạp tiền');
        }
      } catch (err) {
        console.error('Fetch service error:', err);
        setError(err.message || 'Không thể tải thông tin dịch vụ');
      } finally {
        setServiceLoading(false);
      }
    };

    fetchService();
  }, [serviceCode, token]);

  const handleRequestChange = useCallback((e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleRequestSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const body = {
          serviceCode,
          receiverPhone: requestData.receiverPhone,
          amount: Number(requestData.amount),
        };

        const result = await requestCashInAPI(token, body);

        setTransRefId(result.transRefId);
        setConfirmData(result);

        setSuccess(
          `Yêu cầu nạp ${result.amount.toLocaleString()} VNĐ cho ${result.receiverName} (${result.receiverPhone}) thành công!`
        );

        setTimeout(() => {
          setSuccess('');
          setActiveStep(1);
        }, 1500);
      } catch (err) {
        setError(err.message || 'Yêu cầu nạp tiền thất bại');
      } finally {
        setLoading(false);
      }
    },
    [serviceCode, requestData, token]
  );

  const handleConfirmSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setLoading(true);
      setError('');
      setSuccess('');

      try {
        // Step 2: Confirm transaction
        await confirmCashInAPI(token, { transRefId });

        // Step 3: Verify transaction in the background
        await verifyCashInAPI(token, { transRefId });

        setSuccess('Nạp tiền thành công!');

        setTimeout(() => {
          setSuccess('');
          navigate('/admin/cash-in');
        }, 2000);
      } catch (err) {
        setError(err.message || 'Xác nhận nạp tiền thất bại');
      } finally {
        setLoading(false);
      }
    },
    [transRefId, token, navigate]
  );

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setRequestData({
      receiverPhone: '',
      amount: '',
    });
    setTransRefId('');
    setConfirmData(null);
    setError('');
    setSuccess('');
  }, []);

  const handleBack = useCallback(() => {
    navigate('/admin/cash-in');
  }, [navigate]);

  return {
    activeStep,
    loading,
    serviceLoading,
    error,
    success,
    transRefId,
    requestData,
    setRequestData,
    confirmData,
    service,
    handleRequestChange,
    handleRequestSubmit,
    handleConfirmSubmit,
    handleReset,
    handleBack,
  };
};
