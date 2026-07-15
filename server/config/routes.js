module.exports.routes = {
  'GET /': (_req, res) => {
    return res.send('Xin chào, tôi là server Mini-Wallet');
  },

  // customer routes
  'POST /api/customer/register': 'CustomerController.register',
  'POST /api/customer/login': 'CustomerController.login',
  // 'POST /api/customer/logout': 'CustomerController.logout',
  'POST /api/customer/me': 'CustomerController.me',
  // 'PUT /api/customer/me': 'CustomerController.updateMe',
  // 'PUT /api/customer/change-password': 'CustomerController.changePassword',
  // 'PUT /api/customer/change-pin': 'CustomerController.changePin',
  'GET /api/customer/all': 'CustomerController.getAll',
  'PUT /api/customer/:id/status': 'CustomerController.updateStatus',
  'POST /api/customer/wallet': 'PocketController.me',
  'POST /api/transaction/history': 'TransactionController.history',
  'POST /api/pocket/all': 'PocketController.getAll',
  'POST /api/pocket/transactions': 'PocketController.getTransactions',

  // Cash-in (Admin only)
  'POST /api/cash-in/request': 'CashInController.request',
  'POST /api/cash-in/confirm': 'CashInController.confirm',
  'GET /api/cash-in/history': 'CashInController.getHistory',
  'GET /api/cash-in/services': 'CashInController.getServices',

  // Transaction
  'POST /api/transaction/request': 'TransactionController.request',
  'POST /api/transaction/confirm': 'TransactionController.confirm',
  'POST /api/transaction/verify': 'TransactionController.verify',

  // Service
  'POST /api/service/get-by-code': 'ServiceController.getByCode',
  'POST /api/service/get-all': 'ServiceController.getAll',
  'POST /api/service/create': 'ServiceController.create',
};
