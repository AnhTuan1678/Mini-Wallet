import { Button, Container, Grid, Stack, Typography } from '@mui/material';

import BasicInfoSection from './components/BasicInfoSection';
import FieldBuildersSection from './components/FieldBuildersSection';
import TransFieldsSection from './components/TransFieldsSection';
import ValidationsSection from './components/ValidationsSection';
import useService from '../../contexts/useService';
import { updateServiceAPI } from '../../services/serviceApi';

const Service = () => {
  const {
    service,
    transField,
    fieldBuilder,
    transValidation,
    loading,
    setLoading,
    reset,
  } = useService();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...service,
      validations: transValidation,
      transFields: transField,
      fieldBuilders: fieldBuilder,
      definition: { glSteps: [] },
    };

    try {
      setLoading(true);
      await updateServiceAPI(payload);
      reset();
      console.log('Tạo dịch vụ thành công:', payload);
    } catch (error) {
      console.error('Tạo dịch vụ thất bại:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='xl'>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
        Chi tiết dịch vụ
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <BasicInfoSection />
          <ValidationsSection />
          <TransFieldsSection />
          <FieldBuildersSection />

          <Grid size={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{ justifyContent: 'flex-end' }}
            >
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Service;
