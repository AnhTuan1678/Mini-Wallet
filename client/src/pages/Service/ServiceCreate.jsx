import {
  Alert,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import useServiceCreate from '../../hooks/useServiceCreate';
import BasicInfoSection from './components/BasicInfoSection';
import ValidationsSection from './components/ValidationsSection';
import TransFieldsSection from './components/TransFieldsSection';
import FieldBuildersSection from './components/FieldBuildersSection';

const ServiceCreate = () => {
  const {
    formData,
    selectedValidations,
    error,
    success,
    handleChange,
    handleValidationToggle,
    handleTransFieldChange,
    addTransField,
    removeTransField,
    handleFieldBuilderChange,
    addFieldBuilder,
    removeFieldBuilder,
    handleSubmit,
  } = useServiceCreate();

  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' fontWeight={700} mb={3}>
        Tạo Dịch Vụ Mới
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mb: 3 }}>
          Tạo dịch vụ thành công!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <BasicInfoSection formData={formData} handleChange={handleChange} />
          <ValidationsSection
            selectedValidations={selectedValidations}
            formData={formData}
            handleValidationToggle={handleValidationToggle}
          />
          <TransFieldsSection
            transFields={formData.transFields}
            handleTransFieldChange={handleTransFieldChange}
            addTransField={addTransField}
            removeTransField={removeTransField}
          />
          <FieldBuildersSection
            fieldBuilders={formData.fieldBuilders}
            handleFieldBuilderChange={handleFieldBuilderChange}
            addFieldBuilder={addFieldBuilder}
            removeFieldBuilder={removeFieldBuilder}
          />

          {/* Submit Button */}
          <Grid item xs={12}>
            <Stack direction='row' spacing={2} justifyContent='flex-end'>
              <Button type='submit' variant='contained' size='large'>
                Tạo Dịch Vụ
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ServiceCreate;
