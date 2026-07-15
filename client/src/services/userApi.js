import { API_BASE_URL } from '../constants/api';

export const getAllUsersAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/customer/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log('Raw API response:', data);

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Get all users failed:', data);
    throw new Error(data.message || 'Không thể tải danh sách người dùng');
  }

  // Handle different response formats
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

export const updateUserStatusAPI = async (token, userId, status) => {
  const response = await fetch(
    `${API_BASE_URL}/api/customer/${userId}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Update user status failed:', data);
    throw new Error(data.message || 'Không thể cập nhật trạng thái người dùng');
  }

  return data;
};
