import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  autoComplete = 'current-password',
  required = true,
  fullWidth = true,
  margin = 'normal',
  id,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      id={id}
      label={label}
      name={name}
      autoComplete={autoComplete}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                edge='end'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
