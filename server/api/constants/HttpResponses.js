module.exports = {
  SUCCESS: {
    error: 200,
    message: 'Thành công',
  },

  BAD_REQUEST: {
    error: 400,
    message: 'Yêu cầu không hợp lệ',
  },

  UNAUTHORIZED: {
    error: 401,
    message: 'Chưa đăng nhập hoặc token không hợp lệ',
  },

  FORBIDDEN: {
    error: 403,
    message: 'Không được phép truy cập',
  },

  NOT_FOUND: {
    error: 404,
    message: 'Không tìm thấy tài nguyên',
  },

  INTERNAL_SERVER_ERROR: {
    error: 500,
    message: 'Lỗi máy chủ',
  },
};
