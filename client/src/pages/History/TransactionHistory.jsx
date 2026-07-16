import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import FilterPanel from '../../components/TransactionHistory/FilterPanel';
import TransactionTable from '../../components/TransactionHistory/TransactionTable';

const TransactionHistory = () => {
  const {
    loading,
    error,
    pocket,
    transactions,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    resetFilters,
  } = useTransactionHistory();

  if (loading) {
    return (
      <Box display='flex' py={8} sx={{ justifyContent: 'center' }}>
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

      {!pocket && (
        <Alert severity='info' sx={{ mb: 3 }}>
          Admin đang xem tất cả giao dịch trong hệ thống
        </Alert>
      )}

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
      />

      <Card>
        <TransactionTable transactions={transactions} />
      </Card>
    </Container>
  );
};

export default TransactionHistory;
