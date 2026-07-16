import { Box, Button, CircularProgress, Typography } from '@mui/material';

const CashInConfirm = ({
  confirmData,
  handleConfirmSubmit,
  handleReset,
  loading,
}) => {
  return (
    <Box component='form' onSubmit={handleConfirmSubmit}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Xác nhận thông tin nạp tiền
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography color='text.secondary'>Dịch vụ:</Typography>
        <Typography fontWeight={600}>
          {confirmData.serviceName}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography color='text.secondary'>Người nhận:</Typography>
        <Typography fontWeight={600}>
          {confirmData.receiverName} ({confirmData.receiverPhone})
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography color='text.secondary'>Số tiền:</Typography>
        <Typography fontWeight={600} color='primary'>
          {confirmData.amount.toLocaleString()} MMK
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography color='text.secondary'>Phí:</Typography>
        <Typography fontWeight={600}>
          {confirmData.fee.toLocaleString()} MMK
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography color='text.secondary'>Tổng:</Typography>
        <Typography fontWeight={700} color='primary' variant='h5'>
          {confirmData.totalAmount.toLocaleString()} MMK
        </Typography>
      </Box>

      <Button
        fullWidth
        type='submit'
        variant='contained'
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Xác nhận nạp tiền'}
      </Button>

      <Button
        fullWidth
        variant='outlined'
        onClick={handleReset}
        disabled={loading}
      >
        Hủy
      </Button>
    </Box>
  );
};

export default CashInConfirm;
