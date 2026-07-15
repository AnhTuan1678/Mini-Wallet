import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
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
                {transaction.senderPocket?.type === 'system'
                  ? 'Hệ thống'
                  : transaction.senderPocket?.id || 'N/A'}
              </TableCell>

              <TableCell>
                {transaction.receiverPocket?.type === 'system'
                  ? 'Hệ thống'
                  : transaction.receiverPocket?.id || 'N/A'}
              </TableCell>

              <TableCell align='right'>
                {transaction.amount?.toLocaleString() || 0} đ
              </TableCell>

              <TableCell align='right'>
                {transaction.fee?.toLocaleString() || 0} đ
              </TableCell>

              <TableCell align='right'>
                {transaction.totalAmount?.toLocaleString() || 0} đ
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
