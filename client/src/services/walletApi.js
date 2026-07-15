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

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get wallet failed:', data);
    throw new Error(data.message || 'Get wallet failed');
  }

  return data;
};

export const getAllWalletsAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/pocket/all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get all wallets failed:', data);
    throw new Error(data.message || 'Get all wallets failed');
  }

  return data.data || [];
};

export const getWalletTransactionsAPI = async (token, pocketId) => {
  const response = await fetch(`${API_BASE_URL}/api/pocket/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pocketId }),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get wallet transactions failed:', data);
    throw new Error(data.message || 'Get wallet transactions failed');
  }

  return data.data || [];
};
