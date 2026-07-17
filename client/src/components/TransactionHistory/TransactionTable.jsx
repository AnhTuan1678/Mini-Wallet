import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from '@mui/material';

const STATUS = {
  done: {
    label: 'Thành công',
    color: 'success',
  },
  pending: {
    label: 'Đang xử lý',
    color: 'warning',
  },
  failed: {
    label: 'Thất bại',
    color: 'error',
  },
};

const getPocketDisplay = (pocket) => {
  if (!pocket) return { title: 'N/A', subtitle: '' };

  if (pocket.type === 'system') {
    return { title: 'System', subtitle: pocket.id || '' };
  }

  if (pocket.type === 'bank') {
    return { title: 'Bank', subtitle: pocket.id || '' };
  }

  const ownerName =
    pocket.owner?.name ||
    pocket.customer?.name ||
    pocket.biller?.name ||
    pocket.name ||
    pocket?.type ||
    '';
  const pocketId = pocket.id || '';

  return {
    title: ownerName || pocketId || 'N/A',
    subtitle: ownerName && pocketId ? pocketId : '',
  };
};

const TransactionTable = ({ transactions }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Mã giao dịch</TableCell>
          <TableCell>Tài khoản gửi</TableCell>
          <TableCell>Tài khoản nhận</TableCell>
          <TableCell align='right'>Số tiền</TableCell>
          <TableCell align='right'>Phí</TableCell>
          <TableCell align='right'>Tổng</TableCell>
          <TableCell>Trạng thái</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align='center'>
              Chưa có giao dịch
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.transRefId}</TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' fontWeight={600}>
                    {getPocketDisplay(transaction.senderPocket).title}
                  </Typography>
                  {getPocketDisplay(transaction.senderPocket).subtitle && (
                    <Typography variant='caption' color='text.secondary'>
                      {getPocketDisplay(transaction.senderPocket).subtitle}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' fontWeight={600}>
                    {getPocketDisplay(transaction.receiverPocket).title}
                  </Typography>
                  {getPocketDisplay(transaction.receiverPocket).subtitle && (
                    <Typography variant='caption' color='text.secondary'>
                      {getPocketDisplay(transaction.receiverPocket).subtitle}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell align='right'>
                {transaction.amount?.toLocaleString() || 0} MMK
              </TableCell>

              <TableCell align='right'>
                {transaction.fee?.toLocaleString() || 0} MMK
              </TableCell>

              <TableCell align='right'>
                {transaction.totalAmount?.toLocaleString() || 0} MMK
              </TableCell>

              <TableCell>
                <Chip
                  size='small'
                  label={
                    STATUS[transaction.status]?.label ?? transaction.status
                  }
                  color={STATUS[transaction.status]?.color ?? 'default'}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
