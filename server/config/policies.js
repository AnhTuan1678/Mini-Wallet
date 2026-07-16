module.exports.policies = {
  '*': false,
  'GET /': true,

  CustomerController: {
    register: true,
    login: true,
    me: 'isLoggedIn',
    // update: 'isLoggedIn',
    // changePassword: 'isLoggedIn',
    // changePin: 'isLoggedIn',
    getAll: ['isLoggedIn', 'isAdmin'],
    updateStatus: ['isLoggedIn', 'isAdmin'],
    // get: 'isLoggedIn',
    // delete: 'isLoggedIn',
  },

  PocketController: {
    me: 'isLoggedIn',
    getAll: ['isLoggedIn', 'isAdmin'],
    getTransactions: ['isLoggedIn', 'isAdmin'],
  },

  CashInController: {
    request: ['isLoggedIn', 'isAdmin'],
    confirm: ['isLoggedIn', 'isAdmin'],
    getHistory: ['isLoggedIn', 'isAdmin'],
    getServices: ['isLoggedIn', 'isAdmin'],
  },

  TransactionController: {
    request: 'isLoggedIn',
    confirm: 'isLoggedIn',
    verify: 'isLoggedIn',
    history: 'isLoggedIn',
  },

  BillerController: {
    getAll: 'isLoggedIn',
    create: ['isLoggedIn', 'isAdmin'],
    getBillsForUser: 'isLoggedIn',
  },

  BillerGatewayController: {
    inquiry: true,
    payment: true,
  },

  ServiceController: {
    getByCode: true,
    getAll: true,
    create: true,
    update: ['isLoggedIn', 'isAdmin'],
  },
};
