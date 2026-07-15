import { useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { LockOutlined, PersonAdd } from '@mui/icons-material';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import useLoginRegister from '../../hooks/useLoginRegister';
import { TAB_LOGIN } from '../../constants/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [tabValue, setTabValue] = useState(TAB_LOGIN);
  const navigate = useNavigate();

  const {
    loading,
    error,
    success,
    loginData,
    registerData,
    handleLoginChange,
    handleRegisterChange,
    handleLogin,
    handleRegister,
  } = useLoginRegister({
    onRegisterSuccess: () => {
      setTabValue(TAB_LOGIN);
    },
  });

  const handleLoginSubmit = async (e) => {
    const success = await handleLogin(e);
    if (success) {
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {tabValue === TAB_LOGIN ? (
              <LockOutlined
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
            ) : (
              <PersonAdd
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
            )}

            <Typography component='h1' variant='h5' sx={{ mb: 3 }}>
              {tabValue === TAB_LOGIN ? 'Đăng Nhập' : 'Đăng Ký'}
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label='Đăng Nhập' />
            <Tab label='Đăng Ký' />
          </Tabs>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {tabValue === TAB_LOGIN ? (
            <LoginForm
              loading={loading}
              data={loginData}
              onChange={handleLoginChange}
              onSubmit={handleLoginSubmit}
            />
          ) : (
            <RegisterForm
              loading={loading}
              data={registerData}
              onChange={handleRegisterChange}
              onSubmit={handleRegister}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;
