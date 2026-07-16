import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

import useTransfer from '../../hooks/useTransfer';

const STEPS = ['Nhập thông tin', 'Xác nhận', 'Xác thực PIN'];

const TransferForm = ({ service }) => {
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

  return (
    <Container maxWidth='sm'>
      <Box sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
            Chuyển tiền
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
                service.transFields.map((field) => (
                  <TextField
                    key={field.id}
                    fullWidth
                    label={field.name}
                    name={field.code}
                    value={requestData[field.code]}
                    type={field.dataType || 'text'}
                    onChange={handleRequestChange}
                    margin='normal'
                    required
                  />
                ))
              )}

              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mt: 3 }}
                disabled={loading}
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
