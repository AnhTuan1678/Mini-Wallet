import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getTransactionHistoryAPI } from '../../services/transactionApi';
import useAuth from '../../contexts/useAuth';

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

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pocket, setPocket] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getTransactionHistoryAPI(token);

        setPocket(data.pocket);
        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err.message || 'Không thể tải lịch sử giao dịch');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' fontWeight={700} mb={3}>
        Lịch sử giao dịch
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {pocket && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography color='text.secondary'>Số dư hiện tại</Typography>

            <Typography variant='h4' fontWeight={700} color='primary'>
              {pocket.balance.toLocaleString()} {pocket.currency}
            </Typography>

            <Typography variant='body2' color='text.secondary' mt={1}>
              Trạng thái: {pocket.status}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã giao dịch</TableCell>
              <TableCell align='right'>Số tiền</TableCell>
              <TableCell align='right'>Phí</TableCell>
              <TableCell align='right'>Tổng</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  Chưa có giao dịch
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.transRefId}</TableCell>

                  <TableCell align='right'>
                    {transaction.amount.toLocaleString()} đ
                  </TableCell>

                  <TableCell align='right'>
                    {transaction.fee.toLocaleString()} đ
                  </TableCell>

                  <TableCell align='right'>
                    {transaction.totalAmount.toLocaleString()} đ
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
      </Card>
    </Container>
  );
};

export default TransactionHistory;
