import { API_BASE_URL } from '../constants/api';

export const getServiceByCodeAPI = async (code) => {
  const response = await fetch(`${API_BASE_URL}/api/service/get-by-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get service by code failed:', data);
    throw new Error(data.message || 'Lấy thông tin dịch vụ thất bại');
  }

  return data;
};

export const getAllServicesAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/api/service/get-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get all services failed:', data);
    throw new Error(data.message || 'Lấy danh sách dịch vụ thất bại');
  }

  return data;
};

export const createServiceAPI = async (serviceData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/service/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();

  if (
    !response.ok ||
    (data.error && data.error !== 200 && data.error !== 201)
  ) {
    console.error('Create service failed:', data);
    const error = new Error(data.message || 'Tạo dịch vụ thất bại');
    if (data.errors) {
      error.errors = data.errors;
    }
    throw error;
  }

  return data;
};

export const updateServiceAPI = async (serviceData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/service/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Update service failed:', data);
    const error = new Error(data.message || 'Cập nhật dịch vụ thất bại');
    if (data.errors) {
      error.errors = data.errors;
    }
    throw error;
  }

  return data;
};
