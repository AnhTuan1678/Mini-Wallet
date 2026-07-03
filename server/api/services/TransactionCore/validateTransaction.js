const validateFuncs = {
  validateReceiverIsNotSender(senderId, receiverId, errorCode) {
    if (senderId === receiverId) {
      throw new Error(errorCode);
    }
  },

  async validateSenderAccountSufficiency(
    senderId,
    amount,
    debitFee,
    errorCode
  ) {
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error(errorCode);
    }
  },
};

// validateAmount
// validateReceiverIsNotSender
// validatePocketChecksum
// validateTransactionLimit
// validatePIN
// validateExpiryTime

module.exports = function ({ trail }) {
  const transBody = trail.inputMessage.transBody;
  const feeSnapshot = trail.inputMessage.feeSnapshot;
  const service = trail.service;

  //
  // ===========================
  // Validation Rules (Examples)
  // ===========================
  //

  const validationRules = [
    {
      validateFunc: 'validateReceiverIsNotSender',
      validateFields: 'senderId:receiverId',
      errorCode: 'RECEIVER_IS_SENDER',
    },
    {
      validateFunc: 'validateSenderAccountSufficiency',
      validateFields: 'senderId:amount:debitFee',
      errorCode: 'INSUFFICIENT_BALANCE',
    },
  ];

  //
  // ===========================
  // Execute Validation Rules
  // ===========================
  //
};
