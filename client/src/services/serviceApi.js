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

  if (data.error && data.error !== 200) {
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

  if (data.error && data.error !== 200) {
    console.error('Get all services failed:', data);
    throw new Error(data.message || 'Lấy danh sách dịch vụ thất bại');
  }

  return data;
};

