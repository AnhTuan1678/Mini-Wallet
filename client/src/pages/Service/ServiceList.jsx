import { useEffect, useState } from 'react';
import useService from '../../hooks/useService';
import { getAllServicesAPI } from '../../services/serviceApi';
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
import Service from './Service';

const ServiceList = () => {
  const [list, setList] = useState([]);
  const {
    service,
    fieldBuilder,
    transField,
    transValidation,
    setService,
    setFieldBuilder,
    setTransField,
    setTransValidation,
    changeService,
    handleValidationToggle,
    handleTransFieldChange,
    removeTransField,
    addTransField,
    handleFieldBuilderChange,
    removeFieldBuilder,
    addFieldBuilder,
  } = useService();

  useEffect(() => {
    const fetchServices = async () => {
      const services = await getAllServicesAPI();
      setList(services.services || []);
    };
    fetchServices();
  }, []);

  if (list.length === 0) {
    return (
      <Box display='flex' mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (service.name !== '') {
    return (
      <Service
        service={service}
        fieldBuilder={fieldBuilder}
        transField={transField}
        transValidation={transValidation}
        changeService={changeService}
        handleValidationToggle={handleValidationToggle}
        handleTransFieldChange={handleTransFieldChange}
        removeTransField={removeTransField}
        addTransField={addTransField}
        handleFieldBuilderChange={handleFieldBuilderChange}
        removeFieldBuilder={removeFieldBuilder}
        addFieldBuilder={addFieldBuilder}
      />
    );
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' fontWeight={700} mb={4}>
        Chọn dịch vụ
      </Typography>

      <Grid container spacing={3}>
        {list.map((service) => (
          <Grid xs={12} sm={6} md={4} key={service.code}>
            <Card>
              <CardActionArea
                onClick={() => {
                  setService(service);
                  setFieldBuilder(service.fieldBuilders || []);
                  setTransField(service.transFields || []);
                  setTransValidation(service.validations || []);
                }}
              >
                <CardContent>
                  <Typography variant='h6'>{service.name}</Typography>

                  <Typography color='text.secondary' mt={1}>
                    {service.code}
                  </Typography>

                  {service.description && (
                    <Typography variant='body2' mt={2}>
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
