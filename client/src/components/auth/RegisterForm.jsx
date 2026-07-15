import { Box, Button, CircularProgress, TextField } from '@mui/material';

import PasswordField from './PasswordField';

const RegisterForm = ({ data, loading, onChange, onSubmit }) => {
  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');

    if (value.length <= 6) {
      onChange({
        target: {
          name: 'pin',
          value,
        },
      });
    }
  };

  return (
    <Box component='form' onSubmit={onSubmit} sx={{ mt: 1 }}>
      <TextField
        margin='normal'
        required
        fullWidth
        autoFocus
        id='register-name'
        label='Họ tên'
        name='name'
        autoComplete='name'
        value={data.name}
        onChange={onChange}
      />

      <TextField
        margin='normal'
        required
        fullWidth
        id='register-email'
        label='Email'
        name='email'
        autoComplete='email'
        value={data.email}
        onChange={onChange}
      />

      <TextField
        margin='normal'
        required
        fullWidth
        id='register-phone'
        label='Số điện thoại'
        name='phone'
        autoComplete='tel'
        value={data.phone}
        onChange={onChange}
      />

      <PasswordField
        id='register-password'
        label='Mật khẩu'
        name='password'
        autoComplete='new-password'
        value={data.password}
        onChange={onChange}
      />

      <PasswordField
        id='register-confirm-password'
        label='Xác nhận mật khẩu'
        name='confirmPassword'
        autoComplete='new-password'
        value={data.confirmPassword}
        onChange={onChange}
      />

      <TextField
        margin='normal'
        required
        fullWidth
        id='register-pin'
        label='PIN (6 số)'
        name='pin'
        type='password'
        autoComplete='off'
        value={data.pin}
        onChange={handlePinChange}
        slotProps={{
          htmlInput: {
            maxLength: 6,
            inputMode: 'numeric',
            pattern: '[0-9]*',
          },
        }}
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
        {loading ? <CircularProgress size={24} /> : 'Đăng Ký'}
      </Button>
    </Box>
  );
};

export default RegisterForm;
