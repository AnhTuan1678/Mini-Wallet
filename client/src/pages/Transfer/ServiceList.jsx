import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
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
            <Card>
              <CardActionArea
                // onClick={() => navigate(`/transfer/${service.code}`)}
                onClick={() => setService(service)}
              >
                <CardContent>
                  <Typography variant='h6'>{service.name}</Typography>

                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    {service.code}
                  </Typography>

                  {service.description && (
                    <Typography variant='body2' sx={{ mt: 2 }}>
                      {service.description}
                    </Typography>
                  )}
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
