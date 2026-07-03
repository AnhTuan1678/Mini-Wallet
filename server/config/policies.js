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

  TransactionController: {
    request: 'isLoggedIn',
    confirm: 'isLoggedIn',
    verify: 'isLoggedIn',
  },
};
