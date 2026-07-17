import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useAuth from '../../contexts/useAuth';
import { createBillerAPI, getBillersAPI } from '../../services/billerApi';

const initialForm = {
  name: '',
  inquiryUrl: '',
  paymentUrl: '',
};

export default function BillerList() {
  const { token } = useAuth();
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  const fetchBillers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getBillersAPI(token);
      setBillers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách biller.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;
      setLoading(true);
      setError('');
      try {
        const data = await getBillersAPI(token);
        if (!mounted) return;
        setBillers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Không thể tải danh sách biller.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateMessage('');
    setCreating(true);

    try {
      await createBillerAPI(createForm, token);
      setCreateMessage('Tạo biller thành công.');
      setCreateForm(initialForm);
      fetchBillers();
    } catch (err) {
      setCreateError(err.message || 'Không thể tạo biller.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' fontWeight={700}>
          Danh sách Biller
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
              Tạo biller mới
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
              <TextField
                fullWidth
                label='Tên biller'
                name='name'
                value={createForm.name}
                onChange={handleCreateChange}
                margin='normal'
                required
              />

              <TextField
                fullWidth
                label='URL inquiry'
                name='inquiryUrl'
                value={createForm.inquiryUrl}
                onChange={handleCreateChange}
                onChange={handleCreateChange}
                margin='normal'
                required
              />

              <TextField
                fullWidth
                label='Payment URL'
                name='paymentUrl'
                value={createForm.paymentUrl}
                onChange={handleCreateChange}
                margin='normal'
                required
              />

              <Stack
                direction='row'
                spacing={2}
                sx={{ mt: 3, justifyContent: 'flex-end' }}
              >
                <Button type='submit' variant='contained' disabled={creating}>
                  {creating ? 'Đang tạo...' : 'Tạo biller'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color='error'>{error}</Typography>
      ) : billers.length === 0 ? (
        <Typography>Không có biller nào.</Typography>
      ) : (
        <Grid container spacing={3}>
          {billers.map((biller) => (
            <Grid key={biller.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant='h6'>{biller.name}</Typography>
                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    Pocket: {biller.pocket}
                  </Typography>
                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    Inquiry URL: {biller.inquiryUrl}
                  </Typography>
                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    Payment URL: {biller.paymentUrl}
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: 600 }}>
                    Trạng thái:{' '}
                    {biller.status ? 'Hoạt động' : 'Không hoạt động'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
