import { useEffect, useState } from 'react';
import ServiceList from './ServiceList';
import TransferForm from './TransferForm';
import { getAllServicesAPI } from '../../services/serviceApi';

export default function Transfer() {
  const [service, setService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllServicesAPI();
        const allServices = data.services || data.data || data;
        // Filter out cash-in services - only admin can use cash-in
        const transferServices = allServices.filter(
          (s) => s.type !== 'cash-in'
        );
        setServices(transferServices);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (service) {
    return <TransferForm service={service} />;
  }
  return (
    <ServiceList
      setService={setService}
      services={services}
      loading={loading}
    />
  );
}
