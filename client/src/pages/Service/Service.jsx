import {
  Alert,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';

import BasicInfoSection from './components/BasicInfoSection';
import FieldBuildersSection from './components/FieldBuildersSection';
import TransFieldsSection from './components/TransFieldsSection';
import ValidationsSection from './components/ValidationsSection';
import useService from '../../contexts/useService';
import { updateServiceAPI, createServiceAPI } from '../../services/serviceApi';
import useAuth from '../../contexts/useAuth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

const Service = ({ mode = 'edit' }) => {
  const {
    service,
    transField,
    fieldBuilder,
    transValidation,
    loading,
    setLoading,
    reset,
  } = useService();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...service,
      validations: transValidation,
      transFields: transField,
      fieldBuilders: fieldBuilder,
      definition: { glSteps: [] },
    };

    setMessage('');
    setError('');

    try {
      setLoading(true);
      if (mode === 'create') {
        await createServiceAPI(payload, token);
        reset();
      } else {
        await updateServiceAPI(payload, token);
      }
      setMessage(
        `${mode === 'create' ? 'Tạo' : 'Cập nhật'} dịch vụ thành công.`
      );
    } catch (error) {
      setError(
        error.errors
          ? error.errors.join(', ')
          : error.message ||
              `${mode === 'create' ? 'Tạo' : 'Cập nhật'} dịch vụ thất bại.`
      );
      console.error(
        `${mode === 'create' ? 'Tạo' : 'Cập nhật'} dịch vụ thất bại:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='xl'>
      <Link
        component='button'
        underline='hover'
        onClick={() => {
          reset();
        }}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          mb: 4,
        }}
      >
        <ArrowBackIcon fontSize='small' />
        Quay lại danh sách
      </Link>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
        {mode === 'create' ? 'Tạo Dịch Vụ Mới' : 'Chi tiết dịch vụ'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <BasicInfoSection />
          <ValidationsSection />
          <TransFieldsSection />
          <FieldBuildersSection />

          {error && (
            <Grid size={12}>
              <Alert severity='error'>{error}</Alert>
            </Grid>
          )}

          {message && (
            <Grid size={12}>
              <Alert severity='success'>{message}</Alert>
            </Grid>
          )}

          <Grid size={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{ justifyContent: 'flex-end' }}
            >
              <Button type='submit' variant='contained' disabled={loading}>
                {loading
                  ? 'Đang lưu...'
                  : mode === 'create'
                    ? 'Tạo Dịch Vụ'
                    : 'Cập nhật'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Service;
