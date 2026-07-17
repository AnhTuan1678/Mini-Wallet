import { API_BASE_URL } from '../constants/api';

export async function createBillAPI(payload, token) {
  const response = await fetch(`${API_BASE_URL}/api/bill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (
    !response.ok ||
    (data.error && data.error !== 200 && data.error !== 201)
  ) {
    throw new Error(data.message || 'Không thể tạo hóa đơn.');
  }

  return data;
}

export async function getAllBillsAPI(token) {
  const response = await fetch(`${API_BASE_URL}/api/bill/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok || (data.error && data.error !== 200)) {
    throw new Error(data.message || 'Không thể tải danh sách hóa đơn.');
  }

  return data.bills || data.data?.bills || [];
}

export async function getBillByIdAPI(id, token) {
  const response = await fetch(`${API_BASE_URL}/api/bill/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Không thể tải hóa đơn.');
  }

  return data.bill || data;
}

export async function updateBillAPI(id, payload, token) {
  const response = await fetch(`${API_BASE_URL}/api/bill/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Không thể cập nhật hóa đơn.');
  }

  return data.bill || data;
}
