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
    // getAll: 'isLoggedIn',
    // get: 'isLoggedIn',
    // delete: 'isLoggedIn',
  },

  PocketController: {
    me: 'isLoggedIn',
  },

  TransactionController: {
    request: 'isLoggedIn',
    confirm: 'isLoggedIn',
    verify: 'isLoggedIn',
    history: 'isLoggedIn',
  },

  ServiceController: {
    getByCode: true,
    getAll: true,
  },
};
