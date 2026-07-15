const validateFuncs = {
  async validateBalance(trail) {
    const { senderId, amount, debitFee } = trail.inputMessage.transBody;
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
  },

  async validateReceiverIsNotSender(trail) {
    const { senderId, receiverId } = trail.inputMessage.transBody;

    if (senderId === receiverId) {
      throw new Error('RECEIVER_IS_SENDER');
    }
  },

  async validatePocketChecksum(trail) {
    const { senderId, amount, debitFee } = trail.inputMessage.transBody;
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
  },

  async validateTransactionLimit(trail) {
    const { senderId, amount, debitFee } = trail.inputMessage.transBody;
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
  },

  async validatePIN(trail) {
    const { senderId, pin } = trail.inputMessage.transBody;
    const expiryTime = trail.expiryTime;

    const user = await User.findOne({ id: senderId });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    if (user.pin !== pin) {
      throw new Error('INVALID_PIN');
    }

    if (Date.now() > expiryTime) {
      throw new Error('TRANSACTION_EXPIRED');
    }
  },

  async validateExpiryTime(trail) {
    const { senderId, amount, debitFee } = trail.inputMessage.transBody;
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
  },

  async validateSenderAccountSufficiency(trail) {
    const { senderId, amount } = trail.inputMessage.transBody;
    const debitFee = trail.feeSnapshot;
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
  },
};

module.exports = async function ({ trail }) {
  const validationRules = await TransValidation.find({
    service: trail.service,
  });

  if (!validationRules) {
    return;
  }

  for (const rule of validationRules) {
    await validateFuncs[rule.validateFunc](trail);
  }
};
