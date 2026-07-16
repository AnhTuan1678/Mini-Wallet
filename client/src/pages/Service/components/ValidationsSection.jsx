import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import { PREDEFINED_VALIDATIONS } from '../../../constants/PREDEFINED_VALIDATIONS';

const ValidationsSection = ({
  selectedValidations,
  handleValidationToggle,
}) => {
  return (
    <Grid sx={{ width: '100%' }} size={12}>
      <Card>
        <CardContent>
          <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
            Validations
          </Typography>
          <Grid container spacing={2}>
            {PREDEFINED_VALIDATIONS.map((rule) => (
              <Grid
                key={rule.id}
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedValidations.some(
                        (v) => v.validateFunc === rule.validateFunc
                      )}
                      onChange={() => handleValidationToggle(rule)}
                    />
                  }
                  label={rule.description}
                />
              </Grid>
            ))}
          </Grid>
          {selectedValidations.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography
                variant='subtitle2'
                color='text.secondary'
                sx={{ mb: 1 }}
              >
                Đã chọn ({selectedValidations.length}):
              </Typography>
              {selectedValidations.map((validation, index) => (
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
