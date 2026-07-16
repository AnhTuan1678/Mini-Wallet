import { Button, Container, Grid, Stack, Typography } from '@mui/material';

import BasicInfoSection from './components/BasicInfoSection';
import ValidationsSection from './components/ValidationsSection';
import TransFieldsSection from './components/TransFieldsSection';
import FieldBuildersSection from './components/FieldBuildersSection';

const Service = ({
  service,
  fieldBuilder,
  transField,
  transValidation,
  changeService,
  handleValidationToggle,
  handleTransFieldChange,
  removeTransField,
  addTransField,
  handleFieldBuilderChange,
  removeFieldBuilder,
  addFieldBuilder,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
        Chi tiết dịch vụ
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <BasicInfoSection
            formData={{
              ...service,
              transFields: transField,
              fieldBuilders: fieldBuilder,
            }}
            handleChange={changeService}
          />

          <ValidationsSection
            selectedValidations={transValidation}
            handleValidationToggle={handleValidationToggle}
          />

          <TransFieldsSection
            transFields={transField}
            handleTransFieldChange={handleTransFieldChange}
            addTransField={addTransField}
            removeTransField={removeTransField}
          />

          <FieldBuildersSection
            fieldBuilders={fieldBuilder}
            handleFieldBuilderChange={handleFieldBuilderChange}
            addFieldBuilder={addFieldBuilder}
            removeFieldBuilder={removeFieldBuilder}
          />

          <Grid size={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{ justifyContent: 'flex-end' }}
            >
              <Button variant='contained'>Cập nhật</Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Service;
