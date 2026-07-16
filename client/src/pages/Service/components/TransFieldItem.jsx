import { memo } from 'react';

import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

const TransFieldItem = ({ field, index, onChange, onRemove }) => {
  const updateField = (key, value) => {
    onChange(index, {
      ...field,
      [key]: value,
    });
  };

  return (
    <Stack direction='row' sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
        }}
      >
        <Grid container spacing={0.5}>
          <Grid size={{ xs: 12, md: 1 }}>
            <TextField
              fullWidth
              size='small'
              label='Thứ tự'
              type='number'
              value={field.order ?? ''}
              onChange={(e) => updateField('order', Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size='small'
              label='Tên'
              value={field.name ?? ''}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size='small'
              label='Mã'
              value={field.code ?? ''}
              onChange={(e) => updateField('code', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 1.75 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Kiểu dữ liệu</InputLabel>

              <Select
                value={field.dataType ?? ''}
                label='Kiểu dữ liệu'
                onChange={(e) => updateField('dataType', e.target.value)}
              >
                <MenuItem value='string'>String</MenuItem>
                <MenuItem value='number'>Number</MenuItem>
                <MenuItem value='boolean'>Boolean</MenuItem>
                <MenuItem value='date'>Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 1.25 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Bắt buộc</InputLabel>

              <Select
                value={field.isRequired}
                label='Bắt buộc'
                onChange={(e) => updateField('isRequired', e.target.value)}
              >
                <MenuItem value={true}>Có</MenuItem>
                <MenuItem value={false}>Không</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Xuống dòng */}
          <Grid size={{ xs: 12, md: 12 }}></Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Độ dài tối thiểu'
              type='number'
              value={field.minLength ?? ''}
              onChange={(e) =>
                updateField(
                  'minLength',
                  e.target.value === '' ? 0 : Number(e.target.value)
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Độ dài tối đa'
              type='number'
              value={field.maxLength ?? ''}
              onChange={(e) =>
                updateField(
                  'maxLength',
                  e.target.value === '' ? 0 : Number(e.target.value)
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size='small'
              label='Regex Pattern'
              value={field.regex ?? ''}
              onChange={(e) => updateField('regex', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              size='small'
              label='Mã lỗi'
              value={field.errorCode ?? ''}
              onChange={(e) => updateField('errorCode', e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <IconButton color='error' onClick={() => onRemove(index)}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default memo(TransFieldItem);
