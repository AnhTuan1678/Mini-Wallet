import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  getAllWalletsAPI,
  getWalletTransactionsAPI,
} from '../../services/walletApi';
import useAuth from '../../contexts/useAuth';

const STATUS_CONFIG = {
  active: {
    label: 'Hoạt động',
    color: 'success',
  },
  inactive: {
    label: 'Không hoạt động',
    color: 'default',
  },
};

const ROLE_CONFIG = {
  customer: {
    label: 'Khách hàng',
    color: 'info',
  },
  admin: {
    label: 'Quản trị viên',
    color: 'secondary',
  },
  biller: {
    label: 'Nhà cung cấp',
    color: 'primary',
  },
  system: {
    label: 'Hệ thống',
    color: 'default',
  },
  bank: {
    label: 'Ngân hàng',
    color: 'default',
  },
};

const TRANSACTION_STATUS = {
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

const WalletList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const data = await getAllWalletsAPI(token);
        setWallets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch wallets error:', err);
        setError(err.message || 'Không thể tải danh sách ví');
        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [token]);

  const handleRowDoubleClick = async (wallet) => {
    try {
      setSelectedWallet(wallet);
      setTransactionsLoading(true);
      setDialogOpen(true);
      setError('');

      const data = await getWalletTransactionsAPI(token, wallet.id);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch transactions error:', err);
      setError(err.message || 'Không thể tải lịch sử giao dịch');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWallet(null);
    setTransactions([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', py: 8, justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
        Quản lý ví
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mã ví</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tên chủ ví</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell align='right'>Số dư</TableCell>
              <TableCell>Loại ví</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align='center'>
                  Không có ví nào
                </TableCell>
              </TableRow>
            ) : (
              wallets.map((wallet) => (
                <TableRow
                  key={wallet.id}
                  onDoubleClick={() => handleRowDoubleClick(wallet)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <TableCell>{wallet.id}</TableCell>
                  <TableCell>{wallet.code || '-'}</TableCell>
                  <TableCell>{wallet.owner?.phone || '-'}</TableCell>
                  <TableCell>{wallet.owner?.name || '-'}</TableCell>
                  <TableCell>{wallet.owner?.email || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      label={
                        ROLE_CONFIG[wallet.owner?.role]?.label ??
                        wallet.owner?.role
                      }
                      color={
                        ROLE_CONFIG[wallet.owner?.role]?.color ?? 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align='right'>
                    {wallet.balance?.toLocaleString() || 0} {wallet.currency}
                  </TableCell>
                  <TableCell>{wallet.type}</TableCell>
                  <TableCell>
                    <Chip
                      size='small'
                      label={
                        STATUS_CONFIG[wallet.status]?.label ?? wallet.status
                      }
                      color={STATUS_CONFIG[wallet.status]?.color ?? 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle>
          Lịch sử giao dịch - {selectedWallet?.owner?.name} (
          {selectedWallet?.owner?.phone})
        </DialogTitle>
        <DialogContent>
          {transactionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
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
                        {transaction.senderPocket?.owner?.phone || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {transaction.receiverPocket?.owner?.phone || 'N/A'}
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
                            TRANSACTION_STATUS[transaction.status]?.label ??
                            transaction.status
                          }
                          color={
                            TRANSACTION_STATUS[transaction.status]?.color ??
                            'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletList;
