import { API_BASE_URL } from '../constants/api';

export async function getBillersAPI(token) {
  const response = await fetch(`${API_BASE_URL}/api/biller/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok || (data.error && data.error !== 200)) {
    throw new Error(data.message || 'Không thể tải danh sách nhà cung cấp.');
  }
  return data.billers || data.data?.billers || [];
}

export async function getBillsForBillerAPI(billerId, token) {
  const response = await fetch(`${API_BASE_URL}/api/biller/${billerId}/bills`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Không thể tải danh sách hóa đơn.');
  }
  return data.bills || [];
}
