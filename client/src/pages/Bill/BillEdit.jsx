import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useAuth from '../../contexts/useAuth';
import { getAllUsersAPI } from '../../services/userApi';
import { getBillersAPI } from '../../services/billerApi';
import { getBillByIdAPI, updateBillAPI } from '../../services/billApi';

const initialForm = {
  billerId: '',
  billCode: '',
  name: '',
  amount: '',
  customerPhone: '',
  customerId: '',
};

export default function BillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [billers, setBillers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [billStatus, setBillStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBill = async () => {
      try {
        const [loadedBillers, loadedCustomers, bill] = await Promise.all([
          getBillersAPI(token),
          getAllUsersAPI(token),
          getBillByIdAPI(id, token),
        ]);

        setBillers(loadedBillers);
        setCustomers(loadedCustomers);
        setForm({
          billerId: bill.biller?.id || bill.biller || '',
          billCode: bill.billCode || '',
          name: bill.name || '',
          amount: bill.amount ?? '',
          customerPhone: bill.customer?.phone || '',
          customerId: bill.customer?.id || '',
        });
        setBillStatus(bill.status || 'unpaid');
      } catch (err) {
        setError(err.message || 'Không thể tải hóa đơn.');
      } finally {
        setCustomerLoading(false);
        setLoading(false);
      }
    };

    loadBill();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeCustomerPhone = (value) => {
    if (!value) return '';
    return typeof value === 'string'
      ? value.trim().split(' - ')[0].trim()
      : value?.phone?.trim() || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await updateBillAPI(
        id,
        {
          billerId: form.billerId,
          billCode: form.billCode,
          name: form.name,
          amount: Number(form.amount),
          customerPhone:
            normalizeCustomerPhone(form.customerPhone) || undefined,
          customerId: form.customerId || undefined,
        },
        token
      );
      setMessage('Cập nhật hóa đơn thành công.');
    } catch (err) {
      setError(err.message || 'Cập nhật hóa đơn thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const isPaid = billStatus === 'paid';

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box display='flex' justifyContent='center'>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='sm' sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/bills')}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách
      </Button>

      <Card>
        <CardContent>
          <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
            Chỉnh sửa hóa đơn
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {isPaid && (
            <Alert severity='warning' sx={{ mb: 2 }}>
              Hóa đơn đã thanh toán nên không thể chỉnh sửa.
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            <FormControl fullWidth margin='normal' required>
              <InputLabel>Nhà cung cấp</InputLabel>
              <Select
                label='Nhà cung cấp'
                name='billerId'
                value={form.billerId}
                onChange={handleChange}
                disabled={isPaid}
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
              value={form.billCode}
              onChange={handleChange}
              margin='normal'
              required
              disabled={isPaid}
            />

            <TextField
              fullWidth
              label='Tên hóa đơn'
              name='name'
              value={form.name}
              onChange={handleChange}
              margin='normal'
              required
              disabled={isPaid}
            />

            <TextField
              fullWidth
              label='Số tiền'
              name='amount'
              type='number'
              value={form.amount}
              onChange={handleChange}
              margin='normal'
              required
              disabled={isPaid}
            />

            <Autocomplete
              freeSolo
              value={
                customers.find((user) => user.phone === form.customerPhone) ||
                null
              }
              inputValue={form.customerPhone}
              onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                  setForm((prev) => ({
                    ...prev,
                    customerPhone: newInputValue,
                    customerId: '',
                  }));
                }
              }}
              onChange={(_event, newValue) => {
                if (typeof newValue === 'string') {
                  setForm((prev) => ({
                    ...prev,
                    customerPhone: newValue,
                    customerId: '',
                  }));
                } else if (newValue) {
                  setForm((prev) => ({
                    ...prev,
                    customerPhone: newValue.phone,
                    customerId: newValue.id,
                  }));
                } else {
                  setForm((prev) => ({
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
              disabled={isPaid}
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
                disabled={saving || isPaid}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
