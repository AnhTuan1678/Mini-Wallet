import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';

const CashInForm = ({
  requestData,
  handleRequestChange,
  handleRequestSubmit,
  loading,
  service,
  handleBack,
}) => {
  return (
    <Box component='form' onSubmit={handleRequestSubmit}>
      <TextField
        fullWidth
        label='Số điện thoại người nhận'
        name='receiverPhone'
        value={requestData.receiverPhone}
        onChange={handleRequestChange}
        margin='normal'
        required
      />

      <TextField
        fullWidth
        label='Số tiền'
        name='amount'
        type='number'
        value={requestData.amount}
        onChange={handleRequestChange}
        margin='normal'
        required
        slotProps={{ htmlInput: { min: 0 } }}
      />

      {service && service.feeValue > 0 && (
        <Alert severity='info' sx={{ mt: 2 }}>
          Phí:{' '}
          {service.feeType === 'fixed'
            ? `${service.feeValue.toLocaleString()} VNĐ`
            : `${service.feeValue}% của số tiền`}
        </Alert>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant='outlined'
          onClick={handleBack}
          disabled={loading}
        >
          Quay lại
        </Button>
        <Button fullWidth type='submit' variant='contained' disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Tiếp tục'}
        </Button>
      </Box>
    </Box>
  );
};

export default CashInForm;
