import { API_BASE_URL } from '../constants/api';

export const loginAPI = async (phone, password) => {
  const response = await fetch(`${API_BASE_URL}/api/customer/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Login failed:', data);
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  return data;
};

export const registerAPI = async (name, email, phone, password, pin) => {
  const response = await fetch(`${API_BASE_URL}/api/customer/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      pin,
    }),
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Register failed:', data);
    throw new Error(data.message || 'Đăng ký thất bại');
  }

  return data;
};

export const verifyTokenAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/customer/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || (data.error && data.error !== 200)) {
    console.error('Verify token failed:', data);
    throw new Error(data.message || 'Xác thực token thất bại');
  }

  return data;
};
