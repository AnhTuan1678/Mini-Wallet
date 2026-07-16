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
