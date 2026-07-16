import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useCashIn } from '../../hooks/useCashIn';
import CashInForm from '../../components/CashIn/CashInForm';
import CashInConfirm from '../../components/CashIn/CashInConfirm';

const STEPS = ['Nhập thông tin', 'Xác nhận'];

const CashIn = () => {
  const { serviceCode } = useParams();
  const {
    activeStep,
    loading,
    serviceLoading,
    error,
    success,
    service,
    requestData,
    setRequestData,
    confirmData,
    handleRequestChange,
    handleRequestSubmit,
    handleConfirmSubmit,
    handleReset,
    handleBack,
  } = useCashIn(serviceCode);

  if (serviceLoading) {
    return (
      <Container maxWidth='sm'>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container maxWidth='sm'>
        <Alert severity='error' sx={{ mt: 4 }}>
          {error || 'Không tìm thấy dịch vụ nạp tiền'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='sm'>
      <Box sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
            Nạp tiền cho khách hàng
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography color='text.secondary'>Dịch vụ:</Typography>
            <Typography fontWeight={600}>{service.name}</Typography>
          </Box>

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
            <CashInForm
              requestData={requestData}
              setRequestData={setRequestData}
              handleRequestChange={handleRequestChange}
              handleRequestSubmit={handleRequestSubmit}
              loading={loading}
              service={service}
              handleBack={handleBack}
            />
          )}

          {activeStep === 1 && confirmData && (
            <CashInConfirm
              confirmData={confirmData}
              handleConfirmSubmit={handleConfirmSubmit}
              handleReset={handleReset}
              loading={loading}
            />
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default CashIn;
