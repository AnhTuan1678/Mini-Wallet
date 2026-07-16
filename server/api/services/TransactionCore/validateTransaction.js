const { verifyChecksum } = require('../PocketService');

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
    const { senderPocketId, receiverPocketId } = trail.inputMessage.transBody;

    // Kiểm tra checksum ví người gửi
    const senderPocket = await Pocket.findOne({ id: senderPocketId });

    if (!senderPocket) {
      throw new Error('SENDER_POCKET_NOT_FOUND');
    }

    if (!verifyChecksum(senderPocket)) {
      throw new Error('SENDER_POCKET_CHECKSUM_INVALID');
    }

    // Kiểm tra checksum ví người nhận (nếu có)
    if (receiverPocketId) {
      const receiverPocket = await Pocket.findOne({ id: receiverPocketId });

      if (!receiverPocket) {
        throw new Error('RECEIVER_POCKET_NOT_FOUND');
      }

      if (!verifyChecksum(receiverPocket)) {
        throw new Error('RECEIVER_POCKET_CHECKSUM_INVALID');
      }
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

    const user = await Customer.findOne({ id: senderId });

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

  async validateReceiverExists(trail) {
    const { receiverPhone } = trail.inputMessage.transBody;
    const receiver = await Customer.findOne({ phone: receiverPhone });

    if (!receiver) {
      throw new Error('RECEIVER_NOT_FOUND');
    }
  },

  async validateReceiverPocketExists(trail) {
    const { receiverPhone } = trail.inputMessage.transBody;
    const receiver = await Customer.findOne({ phone: receiverPhone });

    if (!receiver) {
      throw new Error('RECEIVER_NOT_FOUND');
    }

    const pocket = await Pocket.findOne({ owner: receiver.id });

    if (!pocket) {
      throw new Error('RECEIVER_POCKET_NOT_FOUND');
    }
  },
};

const validateTransaction = async function ({ trail }) {
  const validationRules = await TransValidation.find({
    service: trail.service,
  });

  if (!validationRules) {
    return;
  }

  for (const rule of validationRules) {
    // Bỏ qua validatePocketChecksum trong vòng lặp động (sẽ gọi trực tiếp trong code)
    if (rule.validateFunc === 'validatePocketChecksum') {
      continue;
    }

    await validateFuncs[rule.validateFunc](trail);
  }
};

validateTransaction.validatePocketChecksum = validateFuncs.validatePocketChecksum;

module.exports = validateTransaction;
