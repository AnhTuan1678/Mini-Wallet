import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

import useTransfer from '../../hooks/useTransfer';
import useAuth from '../../contexts/useAuth';
import { getBillsForBillerAPI } from '../../services/billerApi';

const STEPS = ['Nhập thông tin', 'Xác nhận', 'Xác thực PIN'];

const TransferForm = ({ service, title = 'Chuyển tiền', billers = [] }) => {
  const {
    activeStep,
    loading,
    error,
    success,
    requestData,
    pin,
    handleRequestChange,
    handlePinChange,
    handleRequestSubmit,
    handleConfirmSubmit,
    handleVerifySubmit,
  } = useTransfer(service);

  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const { token } = useAuth();

  const selectedBillerId = requestData.billerId;

  useEffect(() => {
    let isMounted = true;
    if (service?.type === 'bill-payment' && selectedBillerId) {
      // Defer state update to next microtask to avoid ESLint warnings
      Promise.resolve().then(() => {
        if (isMounted) {
          setLoadingBills(true);
        }
      });

      getBillsForBillerAPI(selectedBillerId, token)
        .then((data) => {
          if (isMounted) {
            setBills(data);
            handleRequestChange({ target: { name: 'billCode', value: '' } });
          }
        })
        .catch((err) => {
          console.error('Error fetching bills:', err);
          if (isMounted) {
            setBills([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoadingBills(false);
          }
        });
    } else {
      Promise.resolve().then(() => {
        setBills([]);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [selectedBillerId, service?.type, token, handleRequestChange]);

  return (
    <Container maxWidth='sm'>
      <Box sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
            {title}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box component='form' onSubmit={handleRequestSubmit}>
              {service?.transFields && service.transFields.length > 0 && (
                service.transFields.map((field) => {
                  if (field.code === 'billerId') {
                    return (
                      <FormControl key={field.id} fullWidth required margin='normal' disabled={billers.length === 0}>
                        <InputLabel id='biller-select-label'>{field.name}</InputLabel>
                        <Select
                          labelId='biller-select-label'
                          label={field.name}
                          name={field.code}
                          value={requestData[field.code] || ''}
                          onChange={handleRequestChange}
                        >
                          <MenuItem value='' disabled>Chọn nhà cung cấp</MenuItem>
                          {billers.map((biller) => <MenuItem key={biller.id} value={biller.id}>{biller.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                    );
                  } else if (service?.type === 'bill-payment' && field.code === 'billCode') {
                    return (
                      <FormControl key={field.id} fullWidth required margin='normal' disabled={loadingBills || bills.length === 0}>
                        <InputLabel id='bill-select-label'>{field.name}</InputLabel>
                        <Select
                          labelId='bill-select-label'
                          label={field.name}
                          name={field.code}
                          value={requestData[field.code] || ''}
                          onChange={handleRequestChange}
                        >
                          <MenuItem value='' disabled>
                            {loadingBills ? 'Đang tải hóa đơn...' : bills.length === 0 ? 'Không có hóa đơn cần thanh toán' : 'Chọn hóa đơn'}
                          </MenuItem>
                          {bills.map((bill) => (
                            <MenuItem key={bill.id} value={bill.billCode}>
                              {bill.name} ({Number(bill.amount).toLocaleString()} VND)
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  } else {
                    return (
                      <TextField
                        key={field.id}
                        fullWidth
                        label={field.name}
                        name={field.code}
                        value={requestData[field.code] || ''}
                        type={field.dataType || 'text'}
                        onChange={handleRequestChange}
                        margin='normal'
                        required
                      />
                    );
                  }
                })
              )}

              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mt: 3 }}
                disabled={
                  loading ||
                  (service?.type === 'bill-payment' &&
                    (billers.length === 0 || !requestData.billerId || !requestData.billCode))
                }
              >
                {loading ? <CircularProgress size={24} /> : 'Tiếp tục'}
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box component='form' onSubmit={handleConfirmSubmit}>
              <Typography sx={{ mb: 3 }}>
                Vui lòng xác nhận thông tin chuyển tiền
              </Typography>

              <Button
                fullWidth
                type='submit'
                variant='contained'
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Xác nhận'}
              </Button>
            </Box>
          )}

          {activeStep === 2 && (
            <Box component='form' onSubmit={handleVerifySubmit}>
              <TextField
                fullWidth
                label='PIN'
                type='password'
                value={pin}
                onChange={handlePinChange}
                margin='normal'
                required
              />

              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Hoàn tất'}
              </Button>
            </Box>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default TransferForm;
