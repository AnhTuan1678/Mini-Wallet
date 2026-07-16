const TransactionService = require('../services/TransactionService');

module.exports = {
  // Deprecated - use /api/transaction/request instead
  request: async (req, res) => {
    try {
      const result = await TransactionService.request(req.body, req.user);

      return res.ok(result);
    } catch (err) {
      sails.log.error(err.message);

      return res.badRequest({
        message: err.message || 'Yêu cầu nạp tiền thất bại',
      });
    }
  },

  // Deprecated - use /api/transaction/confirm instead
  confirm: async (req, res) => {
    try {
      const result = await TransactionService.confirm(req.body, req.user);

      return res.ok(result);
    } catch (err) {
      sails.log.error(err.message);

      return res.badRequest({
        message: err.message || 'Xác nhận nạp tiền thất bại',
      });
    }
  },

  getHistory: async (req, res) => {
    try {
      const transactions = await TransactionService.getCashInHistory();

      return res.ok({
        message: 'Thành công',
        data: transactions,
      });
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },

  getServices: async (req, res) => {
    try {
      const services = await TransactionService.getCashInServices();

      return res.ok({
        message: 'Thành công',
        data: services,
      });
    } catch (err) {
      sails.log.error(err.message);

      return res.serverError({
        message: err.message || 'Lỗi hệ thống',
      });
    }
  },
};
