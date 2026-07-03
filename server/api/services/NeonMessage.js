const TransactionCore = require('./TransactionCore');

module.exports = {
  async routeProcess(transInput) {
    switch (transInput.TRANSTEP) {
      case 1:
        return await TransactionCore.processRequestStep(transInput);
      case 2:
        return await TransactionCore.processConfirmStep(transInput);
      case 3:
        return await TransactionCore.processVerifyStep(transInput);
    }
  },
};
