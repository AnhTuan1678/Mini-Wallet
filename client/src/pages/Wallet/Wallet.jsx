import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import PaidIcon from '@mui/icons-material/Paid';

import { getWalletAPI } from '../../services/walletApi';
import useAuth from '../../contexts/useAuth';

const Wallet = () => {
  const { token } = useAuth();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    getWalletAPI(token).then((data) => {
      setWallet(data);
    });
  }, [token]);

  if (!wallet) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant='h4' fontWeight={700} mb={3}>
        Ví của tôi
      </Typography>

      <Card
        elevation={9}
        sx={{
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.3)',
          maxWidth: 400,
        }}
      >
        <CardContent
          sx={{
            p: 2,
            '&:last-child': {
              pb: 2,
            },
          }}
        >
          <Stack>
            <Stack
              direction='row'
              mb={4}
              sx={{ width: '100%', justifyContent: 'space-between' }}
            >
              <Stack direction='row'>
                <Typography color='text.secondary'>
                  {`Ví ${wallet.type}`}
                </Typography>
                <AccountBalanceWalletIcon
                  color='primary'
                  sx={{ fontSize: 18, ml: 1, height: '100%' }}
                />
              </Stack>
              <Typography>
                {wallet.status === 'active' && (
                  <Box component='span' sx={{ color: 'success.main' }}>
                    ●
                  </Box>
                )}
                {wallet.status.toUpperCase()}
                {wallet.status === 'inactive' && (
                  <Chip
                    label='Không hoạt động'
                    color='error'
                    size='small'
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
            </Stack>

            <Typography variant='h7' color='text.secondary' sx={{ my: 2 }}>
              Số dư khả dụng
            </Typography>
            <Typography
              variant='h5'
              color='primary'
              gutterBottom
              sx={{ textAlign: 'center' }}
            >
              {Number(wallet.balance).toLocaleString('vi-VN')} {wallet.currency}
            </Typography>

            <Stack direction='row' spacing={1}>
              <Typography variant='h7'>Mã ví: </Typography>
              <Typography variant='h7'>
                {'•'.repeat(wallet.id.length - 8) + wallet.id.slice(-8)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Wallet;
