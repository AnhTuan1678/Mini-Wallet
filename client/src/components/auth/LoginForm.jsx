import { Box, Button, CircularProgress, TextField } from '@mui/material';

import PasswordField from './PasswordField';

const LoginForm = ({ data, loading, onChange, onSubmit }) => {
  return (
    <Box component='form' onSubmit={onSubmit} sx={{ mt: 1 }}>
      <TextField
        margin='normal'
        required
        fullWidth
        autoFocus
        id='login-phone'
        label='Số điện thoại'
        name='phone'
        autoComplete='tel'
        value={data.phone}
        onChange={onChange}
      />

      <PasswordField
        id='login-password'
        label='Mật khẩu'
        name='password'
        value={data.password}
        onChange={onChange}
      />

      <Button
        fullWidth
        type='submit'
        variant='contained'
        sx={{
          mt: 3,
          mb: 2,
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Đăng Nhập'}
      </Button>
    </Box>
  );
};

export default LoginForm;
