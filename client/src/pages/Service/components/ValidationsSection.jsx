import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';

import { PREDEFINED_VALIDATIONS } from '../../../constants/PREDEFINED_VALIDATIONS';
import useService from '../../../contexts/useService';

const ValidationsSection = ({
  selectedValidations,
  handleValidationToggle,
}) => {
  const context = useService();
  const validations = selectedValidations || context?.transValidation;
  const toggle = handleValidationToggle || context?.handleValidationToggle;

  if (!validations || !toggle) {
    return null;
  }

  return (
    <Grid size={12} sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            Validations (Các rule validate cho giao dịch)
          </Typography>

          <Grid container spacing={2}>
            {PREDEFINED_VALIDATIONS.map((rule) => (
              <Grid
                key={rule.validateFunc}
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={validations.some(
                        (item) => item.validateFunc === rule.validateFunc
                      )}
                      onChange={() => toggle(rule)}
                    />
                  }
                  label={rule.description}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ValidationsSection;
