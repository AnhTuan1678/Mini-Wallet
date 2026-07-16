import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container } from '@mui/material';
import ServiceList from '../Transfer/ServiceList';
import TransferForm from '../Transfer/TransferForm';
import { getAllServicesAPI } from '../../services/serviceApi';
import { getBillersAPI } from '../../services/billerApi';
import useAuth from '../../contexts/useAuth';

export default function BillPayment() {
  const [services, setServices] = useState([]);
  const [billers, setBillers] = useState([]);
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    Promise.all([getAllServicesAPI(), getBillersAPI(token)])
      .then(([serviceData, loadedBillers]) => {
        const all = serviceData.services || serviceData.data || serviceData;
        setServices(
          all.filter((item) => item.type === 'bill-payment' && item.status)
        );
        setBillers(loadedBillers);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Container>
    );
  if (service)
    return (
      <TransferForm
        service={service}
        title='Thanh toán hóa đơn'
        billers={billers}
      />
    );
  return (
    <ServiceList setService={setService} services={services} loading={false} />
  );
}
