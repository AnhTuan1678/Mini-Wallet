import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

const ServiceList = ({ setService, services, loading }) => {
  // const navigate = useNavigate();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 4 }}>
        Chọn dịch vụ
      </Typography>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid
            key={service.code}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card sx={{ opacity: service.status === false ? 0.6 : 1 }}>
              <CardActionArea
                onClick={() => service.status !== false && setService(service)}
                disabled={service.status === false}
              >
                <CardContent>
                  <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      label={service.status ? 'Hoạt động' : 'Tạm dừng'}
                      color={service.status ? 'success' : 'default'}
                      size='small'
                    />
                    <Chip label={service.type || 'transfer'} size='small' />
                  </Stack>

                  <Typography variant='h6'>{service.name}</Typography>

                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    {service.code}
                  </Typography>

                  {service.description && (
                    <Typography variant='body2' sx={{ mt: 2 }}>
                      {service.description}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2'>
                      <strong>Phí:</strong>{' '}
                      {service.feeValue > 0
                        ? service.feeType === 'fixed'
                          ? `${service.feeValue.toLocaleString()} MMK`
                          : `${service.feeValue}% của số tiền`
                        : 'Miễn phí'}
                    </Typography>

                    <Typography variant='body2' sx={{ mt: 0.5 }}>
                      <strong>Xác thực:</strong> {service.authMethod || 'none'}
                    </Typography>

                    <Typography variant='body2' sx={{ mt: 0.5 }}>
                      <strong>Hành động:</strong> {service.action || 'none'}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ServiceList;
