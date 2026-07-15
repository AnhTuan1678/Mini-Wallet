import { API_BASE_URL } from '../constants/api';

export const requestTransactionAPI = async (
  transInputs, // { receiverPhone, serverCode, amount },
  token
) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transInputs),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Request transaction failed:', data);
    throw new Error(data.message || 'Yêu cầu giao dịch thất bại');
  }

  return data;
};

export const confirmTransactionAPI = async (transRefId, token) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ transRefId }),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Confirm transaction failed:', data);
    throw new Error(data.message || 'Xác nhận giao dịch thất bại');
  }

  return data;
};

export const verifyTransactionAPI = async (
  // transRefId, pin
  transInputs,
  token
) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transInputs),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Verify transaction failed:', data);
    throw new Error(data.message || 'Xác thực giao dịch thất bại');
  }

  return data;
};

export const getTransactionHistoryAPI = async (token, filters = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/transaction/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filters),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get transaction history failed:', data);
    throw new Error(data.message || 'Lấy lịch sử giao dịch thất bại');
  }

  return data;
};
