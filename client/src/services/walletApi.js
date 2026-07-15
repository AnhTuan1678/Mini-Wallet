import { API_BASE_URL } from '../constants/api';

export const getWalletAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/customer/wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.error && data.error !== 200) {
    console.error('Get wallet failed:', data);
    throw new Error(data.message || 'Get wallet failed');
  }

  return data;
};
