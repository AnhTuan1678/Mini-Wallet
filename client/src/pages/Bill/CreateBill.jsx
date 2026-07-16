import { useEffect, useState } from 'react';
import {
  Alert,
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
import useAuth from '../../contexts/useAuth';
import { getBillersAPI } from '../../services/billerApi';
import { createBillAPI } from '../../services/billApi';

const initialForm = {
  billerId: '',
  billCode: '',
  name: '',
  amount: '',
  customerId: '',
};

export default function CreateBill() {
  const [form, setForm] = useState(initialForm);
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBillersAPI(token);
        setBillers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await createBillAPI(
        {
          ...form,
          amount: Number(form.amount),
          customerId: form.customerId || undefined,
        },
        token
      );
      setMessage('Tạo hóa đơn thành công.');
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

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
      <Card>
        <CardContent>
          <Typography variant='h5' fontWeight={700} sx={{ mb: 3 }}>
            Tạo hóa đơn mới
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

          <Box component='form' onSubmit={handleSubmit}>
            <FormControl fullWidth margin='normal' required>
              <InputLabel>Nhà cung cấp</InputLabel>
              <Select
                label='Nhà cung cấp'
                name='billerId'
                value={form.billerId}
                onChange={handleChange}
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
            />

            <TextField
              fullWidth
              label='Tên hóa đơn'
              name='name'
              value={form.name}
              onChange={handleChange}
              margin='normal'
              required
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
            />

            <TextField
              fullWidth
              label='Customer ID (tuỳ chọn)'
              name='customerId'
              value={form.customerId}
              onChange={handleChange}
              margin='normal'
            />

            <Stack direction='row' spacing={2} sx={{ mt: 3 }}>
              <Button type='submit' variant='contained' disabled={saving}>
                {saving ? 'Đang tạo...' : 'Tạo hóa đơn'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
