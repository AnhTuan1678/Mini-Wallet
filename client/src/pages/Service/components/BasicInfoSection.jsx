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

const BasicInfoSection = ({ formData, handleChange }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant='h6' fontWeight={600} mb={2}>
            Thông Tin Cơ Bản
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Mã'
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Tên'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Xác thực</InputLabel>
                <Select
                  value={formData.authMethod}
                  onChange={(e) => handleChange('authMethod', e.target.value)}
                  label='Xác thực'
                >
                  <MenuItem value='pin'>PIN</MenuItem>
                  <MenuItem value='none'>Không</MenuItem>
                  <MenuItem value='otp'>OTP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Loại phí</InputLabel>
                <Select
                  value={formData.feeType}
                  onChange={(e) => handleChange('feeType', e.target.value)}
                  label='Loại phí'
                >
                  <MenuItem value='fixed'>Cố định</MenuItem>
                  <MenuItem value='percent'>Phần trăm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Giá trị phí'
                type='number'
                value={formData.feeValue}
                onChange={(e) => handleChange('feeValue', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Phí tối thiểu'
                type='number'
                value={formData.feeMin}
                onChange={(e) => handleChange('feeMin', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Phí tối đa'
                type='number'
                value={formData.feeMax}
                onChange={(e) => handleChange('feeMax', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  label='Trạng thái'
                >
                  <MenuItem value={true}>Hoạt động</MenuItem>
                  <MenuItem value={false}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BasicInfoSection;
