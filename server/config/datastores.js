module.exports.datastores = {
  default: {
    adapter: 'sails-mongo',
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-wallet',
  },
};
