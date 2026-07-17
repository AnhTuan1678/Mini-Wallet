import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useAuth from '../../contexts/useAuth';
import { createBillAPI, getAllBillsAPI } from '../../services/billApi';
import { getAllUsersAPI } from '../../services/userApi';
import { getBillersAPI } from '../../services/billerApi';

const initialForm = {
  billerId: '',
  billCode: '',
  name: '',
  amount: '',
  customerPhone: '',
  customerId: '',
};

export default function BillList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [billers, setBillers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [createForm, setCreateForm] = useState(initialForm);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBills = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAllBillsAPI(token);
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách hóa đơn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      // yield to next tick so any setState inside won't run synchronously in the effect
      await Promise.resolve();

      // Fetch bills
      if (!mounted) return;
      setLoading(true);
      setError('');
      try {
        const data = await getAllBillsAPI(token);
        if (!mounted) return;
        setBills(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Không thể tải danh sách hóa đơn.');
      } finally {
        if (mounted) setLoading(false);
      }

      // Fetch billers
      if (!mounted) return;
      setCreateLoading(true);
      try {
        const data = await getBillersAPI(token);
        if (!mounted) return;
        setBillers(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setCreateLoading(false);
      }

      // Fetch customers
      if (!mounted) return;
      setCustomerLoading(true);
      try {
        const data = await getAllUsersAPI(token);
        if (!mounted) return;
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setCustomerLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  const normalizeCustomerPhone = (value) => {
    if (!value) return '';
    return typeof value === 'string'
      ? value.trim().split(' - ')[0].trim()
      : value?.phone?.trim() || '';
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateMessage('');
    setCreating(true);

    try {
      await createBillAPI(
        {
          ...createForm,
          amount: Number(createForm.amount),
          customerPhone:
            normalizeCustomerPhone(createForm.customerPhone) || undefined,
          customerId: createForm.customerId || undefined,
        },
        token
      );
      setCreateMessage('Tạo hóa đơn thành công.');
      setCreateForm(initialForm);
      fetchBills();
    } catch (err) {
      setCreateError(err.message || 'Không thể tạo hóa đơn.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' fontWeight={700}>
          Danh sách hóa đơn
        </Typography>

        <Button
          variant='contained'
          onClick={() => setShowCreate((prev) => !prev)}
        >
          {showCreate ? 'Đóng' : 'Thêm mới'}
        </Button>
      </Box>

      {showCreate && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant='h5' fontWeight={700} sx={{ mb: 2 }}>
              Tạo hóa đơn mới
            </Typography>

            {createError && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {createError}
              </Alert>
            )}

            {createMessage && (
              <Alert severity='success' sx={{ mb: 2 }}>
                {createMessage}
              </Alert>
            )}

            <Box component='form' onSubmit={handleCreateSubmit}>
              <FormControl fullWidth margin='normal' required>
                <InputLabel>Nhà cung cấp</InputLabel>
                <Select
                  label='Nhà cung cấp'
                  name='billerId'
                  value={createForm.billerId}
                  onChange={handleCreateChange}
                  disabled={createLoading}
                >
                  {billers.map((biller) => (
                    <MenuItem key={biller.id} value={biller.id}>
                      {biller.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label='Mã hóa đơn'
                name='billCode'
                value={createForm.billCode}
                onChange={handleCreateChange}
                margin='normal'
                required
              />

              <TextField
                fullWidth
                label='Tên hóa đơn'
                name='name'
                value={createForm.name}
                onChange={handleCreateChange}
                margin='normal'
                required
              />

              <TextField
                fullWidth
                label='Số tiền'
                name='amount'
                type='number'
                value={createForm.amount}
                onChange={handleCreateChange}
                margin='normal'
                required
              />

              <Autocomplete
                freeSolo
                value={
                  customers.find(
                    (user) => user.phone === createForm.customerPhone
                  ) || null
                }
                inputValue={createForm.customerPhone}
                onInputChange={(_event, newInputValue, reason) => {
                  if (reason === 'input') {
                    setCreateForm((prev) => ({
                      ...prev,
                      customerPhone: newInputValue,
                      customerId: '',
                    }));
                  }
                }}
                onChange={(_event, newValue) => {
                  if (typeof newValue === 'string') {
                    setCreateForm((prev) => ({
                      ...prev,
                      customerPhone: newValue,
                      customerId: '',
                    }));
                  } else if (newValue) {
                    setCreateForm((prev) => ({
                      ...prev,
                      customerPhone: newValue.phone,
                      customerId: newValue.id,
                    }));
                  } else {
                    setCreateForm((prev) => ({
                      ...prev,
                      customerPhone: '',
                      customerId: '',
                    }));
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id || option?.phone === value?.phone
                }
                options={customers}
                getOptionLabel={(option) =>
                  typeof option === 'string'
                    ? option
                    : option.phone
                      ? `${option.phone} - ${option.name}`
                      : ''
                }
                loading={customerLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Số điện thoại khách hàng (tuỳ chọn)'
                    margin='normal'
                  />
                )}
              />

              <Stack
                direction='row'
                spacing={2}
                sx={{ mt: 3, justifyContent: 'flex-end' }}
              >
                <Button
                  type='submit'
                  variant='contained'
                  disabled={creating || createLoading}
                >
                  {creating ? 'Đang tạo...' : 'Tạo hóa đơn'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      {error ? (
        <Typography color='error'>{error}</Typography>
      ) : bills.length === 0 ? (
        <Typography>Không có hóa đơn nào.</Typography>
      ) : (
        <Grid container spacing={3}>
          {bills.map((bill) => (
            <Grid key={bill.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='h6'>{bill.name}</Typography>
                    <Chip
                      label={bill.status?.toUpperCase() || 'UNKNOWN'}
                      color={bill.status === 'paid' ? 'success' : 'warning'}
                      size='small'
                    />
                  </Box>

                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    Mã: {bill.billCode}
                  </Typography>

                  <Typography variant='body2' sx={{ mt: 1 }}>
                    Nhà cung cấp: {bill.biller?.name || bill.biller || '-'}
                  </Typography>

                  <Typography variant='body2' sx={{ mt: 1 }}>
                    Khách hàng:{' '}
                    {bill.customer?.name ||
                      bill.customer?.phone ||
                      bill.customer?.id ||
                      '-'}
                  </Typography>

                  <Typography variant='body2' sx={{ mt: 2, fontWeight: 600 }}>
                    {Number(bill.amount).toLocaleString('vi-VN')} VND
                  </Typography>

                  <Stack
                    direction='row'
                    sx={{ mt: 2, justifyContent: 'flex-end' }}
                  >
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => navigate(`/admin/bill/${bill.id}/edit`)}
                    >
                      Sửa
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
