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

  // Transaction
  'POST /api/transaction/request': 'TransactionController.request',
  'POST /api/transaction/confirm': 'TransactionController.confirm',
  'POST /api/transaction/verify': 'TransactionController.verify',
};
