import { verifyTokenAPI } from '../services/authApi';

export const checkAuth = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Không có token');
  }

  try {
    const user = await verifyTokenAPI(token);
    // So sánh id từ token với id trong localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (user.id !== storedUser.id) {
      throw new Error('Token không hợp lệ');
    }
    return user;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Token không hợp lệ');
  }
};
