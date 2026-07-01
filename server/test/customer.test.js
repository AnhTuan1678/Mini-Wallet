const request = require('supertest');

const api = request('http://localhost:1337');

describe('Customer Authentication', () => {
  it('should register a new customer', async () => {
    const customerData = {
      phone: '+254799507763',
      password: '[PASSWORD]',
      pin: '1234',
      fullName: 'John Doe',
      email: '',
    };

    const response = await api.post('/api/customer/register').send(customerData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('customer');
    expect(response.body.customer).toHaveProperty('phone', customerData.phone);
  });

  it('should login an existing customer', async () => {
    const loginData = {
      phone: '+254799507763',
      password: '[PASSWORD]',
    };

    const response = await api.post('/api/customers/login').send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('customer');
    expect(response.body.customer).toHaveProperty('phone', loginData.phone);
  });
});
