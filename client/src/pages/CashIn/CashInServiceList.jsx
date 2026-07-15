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

const CashInServiceList = ({ setService, services, loading }) => {
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' fontWeight={700} mb={4}>
        Chọn dịch vụ nạp tiền
      </Typography>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.code}>
            <Card>
              <CardActionArea onClick={() => setService(service)}>
                <CardContent>
                  <Typography variant='h6'>{service.name}</Typography>

                  <Typography color='text.secondary' mt={1}>
                    {service.code}
                  </Typography>

                  <Typography variant='body2' mt={2}>
                    {service.feeValue > 0
                      ? service.feeType === 'fixed'
                        ? `Phí: ${service.feeValue.toLocaleString()} VNĐ`
                        : `Phí: ${service.feeValue}% của số tiền`
                      : 'Miễn phí'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CashInServiceList;
