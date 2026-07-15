export function validateRegister(data) {
  if (!data.name.trim()) {
    return 'Vui lòng nhập họ tên.';
  }

  if (!data.email.trim()) {
    return 'Vui lòng nhập email.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {
    return 'Email không hợp lệ.';
  }

  if (!data.phone.trim()) {
    return 'Vui lòng nhập số điện thoại.';
  }

  if (!data.password) {
    return 'Vui lòng nhập mật khẩu.';
  }

  if (data.password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự.';
  }

  if (data.password !== data.confirmPassword) {
    return 'Mật khẩu xác nhận không khớp.';
  }

  if (!/^\d{6}$/.test(data.pin)) {
    return 'PIN phải gồm đúng 6 chữ số.';
  }

  return null;
}
