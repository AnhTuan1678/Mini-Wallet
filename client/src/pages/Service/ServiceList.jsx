import { useEffect, useState } from 'react';
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

import { getAllServicesAPI } from '../../services/serviceApi';

import Service from './Service';

import ServiceProvider from '../../contexts/ServiceProvider';
import useService from '../../contexts/useService';

const ServiceListContent = () => {
  const [list, setList] = useState([]);

  const { service, loadService } = useService();

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getAllServicesAPI();
      setList(result.services || []);
    };

    if (!service.name) {
      fetchServices();
    }
  }, [service.name]);

  if (list.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (service.name) {
    return <Service />;
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' fontWeight={700} sx={{ mb: 4 }}>
        Chọn dịch vụ
      </Typography>

      <Grid container spacing={3}>
        {list.map((item) => (
          <Grid
            key={item.code}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card>
              <CardActionArea onClick={() => loadService(item)}>
                <CardContent>
                  <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      label={item.status ? 'Hoạt động' : 'Tạm dừng'}
                      color={item.status ? 'success' : 'default'}
                      size='small'
                    />
                    <Chip label={item.type || 'transfer'} size='small' />
                  </Stack>

                  <Typography variant='h6'>{item.name}</Typography>

                  <Typography color='text.secondary' sx={{ mt: 1 }}>
                    {item.code}
                  </Typography>

                  {item.description && (
                    <Typography variant='body2' sx={{ mt: 2 }}>
                      {item.description}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2'>
                      <strong>Phí:</strong>{' '}
                      {item.feeValue > 0
                        ? item.feeType === 'fixed'
                          ? `${item.feeValue.toLocaleString()} MMK`
                          : `${item.feeValue}%`
                        : 'Miễn phí'}
                    </Typography>

                    <Typography variant='body2' sx={{ mt: 0.5 }}>
                      <strong>Xác thực:</strong> {item.authMethod || 'none'}
                    </Typography>

                    <Typography variant='body2' sx={{ mt: 0.5 }}>
                      <strong>Hành động:</strong> {item.action || 'none'}
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

export default function ServiceList() {
  return (
    <ServiceProvider>
      <ServiceListContent />
    </ServiceProvider>
  );
}
