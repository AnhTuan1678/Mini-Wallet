import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CashInServiceList from './CashInServiceList';
import { getCashInServicesAPI } from '../../services/cashInApi';
import useAuth from '../../contexts/useAuth';

const CashInIndex = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getCashInServicesAPI(token);
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch services error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  const handleServiceSelect = (service) => {
    navigate(`/admin/cash-in/${service.code}`);
  };

  return (
    <CashInServiceList
      services={services}
      loading={loading}
      setService={handleServiceSelect}
    />
  );
};

export default CashInIndex;
