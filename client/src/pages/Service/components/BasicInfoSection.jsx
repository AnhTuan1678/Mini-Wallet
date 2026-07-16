import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import useService from '../../../contexts/useService';

const BasicInfoSection = ({ formData, handleChange }) => {
  const contextService = useService();
  const service = formData || contextService?.service;
  const changeService = handleChange || contextService?.changeService;

  if (!service || !changeService) {
    return null;
  }

  return (
    <Grid size={12}>
      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            Thông Tin Cơ Bản
          </Typography>

          <Grid container spacing={0.5}>
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
            >
              <TextField
                fullWidth
                label='Mã'
                value={service.code}
                onChange={(e) => changeService('code', e.target.value)}
                required
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
            >
              <TextField
                fullWidth
                label='Tên'
                value={service.name}
                onChange={(e) => changeService('name', e.target.value)}
                required
              />
            </Grid>

            <Grid size={2}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={service.status}
                  label='Trạng thái'
                  onChange={(e) => changeService('status', e.target.value)}
                >
                  <MenuItem value={true}>Hoạt động</MenuItem>
                  <MenuItem value={false}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 1.5,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Xác thực</InputLabel>
                <Select
                  value={service.authMethod}
                  label='Xác thực'
                  onChange={(e) => changeService('authMethod', e.target.value)}
                >
                  <MenuItem value='pin'>PIN</MenuItem>
                  <MenuItem value='none'>Không</MenuItem>
                  <MenuItem value='otp'>OTP</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 1.5,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Loại phí</InputLabel>
                <Select
                  value={service.feeType}
                  label='Loại phí'
                  onChange={(e) => changeService('feeType', e.target.value)}
                >
                  <MenuItem value='fixed'>Cố định</MenuItem>
                  <MenuItem value='percent'>Phần trăm</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 1.5,
              }}
            >
              <TextField
                fullWidth
                label='Giá trị phí'
                type='number'
                value={service.feeValue}
                onChange={(e) =>
                  changeService('feeValue', Number(e.target.value))
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 1.5,
              }}
            >
              <TextField
                fullWidth
                label='Phí tối thiểu'
                type='number'
                value={service.feeMin}
                onChange={(e) =>
                  changeService('feeMin', Number(e.target.value))
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 2,
              }}
            >
              <TextField
                fullWidth
                label='Phí tối đa'
                type='number'
                value={service.feeMax}
                onChange={(e) =>
                  changeService('feeMax', Number(e.target.value))
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BasicInfoSection;
