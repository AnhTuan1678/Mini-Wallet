import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import { PREDEFINED_VALIDATIONS } from '../../../hooks/useServiceCreate';

const ValidationsSection = ({
  selectedValidations,
  formData,
  handleValidationToggle,
}) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant='h6' fontWeight={600} mb={2}>
            Quy tắc xác thực (Validations)
          </Typography>
          <Grid container spacing={2}>
            {PREDEFINED_VALIDATIONS.map((rule) => (
              <Grid item xs={12} md={6} key={rule.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedValidations.includes(rule.id)}
                      onChange={() => handleValidationToggle(rule)}
                    />
                  }
                  label={rule.name}
                />
              </Grid>
            ))}
          </Grid>
          {formData.validations.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant='subtitle2' color='text.secondary' mb={1}>
                Đã chọn ({formData.validations.length}):
              </Typography>
              {formData.validations.map((validation, index) => (
                <Typography key={index} variant='body2' sx={{ ml: 2 }}>
                  {index + 1}. {validation.validateFunc} -{' '}
                  {validation.validateFields}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ValidationsSection;
