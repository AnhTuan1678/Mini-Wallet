import { useState } from 'react';
import useAuth from '../contexts/useAuth';
import { initialLoginData, initialRegisterData } from '../constants/auth';
import { loginAPI, registerAPI } from '../services/authApi';
import { validateRegister } from '../utils/auth.validation';

const useLoginRegister = ({ onRegisterSuccess } = {}) => {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState(initialLoginData);
  const [registerData, setRegisterData] = useState(initialRegisterData);

  const clearMessage = () => {
    setError('');
    setSuccess('');
  };

  const handleLoginChange = ({ target }) => {
    const { name, value } = target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = ({ target }) => {
    const { name, value } = target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    clearMessage();
    setLoading(true);

    try {
      const data = await loginAPI(loginData.phone, loginData.password);
      const { error, message, token, ...user } = data;

      login(user, token);
      setSuccess('Đăng nhập thành công!');

      return true;
    } catch (err) {
      setError(err?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    clearMessage();

    const validationError = validateRegister(registerData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await registerAPI(
        registerData.name,
        registerData.email,
        registerData.phone,
        registerData.password,
        registerData.pin
      );

      setSuccess('Đăng ký thành công!');
      setRegisterData(initialRegisterData);

      setTimeout(() => {
        clearMessage();
        onRegisterSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,

    loginData,
    registerData,

    handleLoginChange,
    handleRegisterChange,

    handleLogin,
    handleRegister,

    clearMessage,
  };
};

export default useLoginRegister;
