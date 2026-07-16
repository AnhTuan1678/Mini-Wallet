import { API_BASE_URL } from '../constants/api';

export const requestCashInAPI = async (token, body) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Request cash-in failed:', data);
    throw new Error(data.message || 'Request cash-in failed');
  }

  return data;
};

export const confirmCashInAPI = async (token, body) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Confirm cash-in failed:', data);
    throw new Error(data.message || 'Confirm cash-in failed');
  }

  return data;
};

export const verifyCashInAPI = async (token, body) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Verify cash-in failed:', data);
    throw new Error(data.message || 'Verify cash-in failed');
  }

  return data;
};

export const getCashInHistoryAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/cash-in/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get cash-in history failed:', data);
    throw new Error(data.message || 'Get cash-in history failed');
  }

  return data.data || [];
};

export const getCashInServicesAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/cash-in/services`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get cash-in services failed:', data);
    throw new Error(data.message || 'Get cash-in services failed');
  }

  return data.data || [];
};
