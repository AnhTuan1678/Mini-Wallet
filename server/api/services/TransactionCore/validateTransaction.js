const { verifyChecksum } = require('../PocketService');

const validateFuncs = {
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

  async validateSenderAccountSufficiency(trail) {
    const { senderId, amount } = trail.inputMessage.transBody;
    const debitFee = trail.feeSnapshot;
    const pocket = await Pocket.findOne({ owner: senderId });

    if (pocket.balance < amount + debitFee) {
      throw new Error('INSUFFICIENT_BALANCE');
    }
  },

  async validateAmountPositive(trail) {
    const { amount } = trail.inputMessage.transBody;

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('AMOUNT_MUST_BE_POSITIVE');
    }
  },

  async validateCustomerActive(trail) {
    const { senderId } = trail.inputMessage.transBody;
    const customer = await Customer.findOne({ id: senderId });

    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    if (customer.status !== 'ACTIVE') {
      throw new Error('CUSTOMER_NOT_ACTIVE');
    }
  },

  async validateReceiverActive(trail) {
    const { receiverId, receiverPhone } = trail.inputMessage.transBody;
    let receiver = null;

    if (receiverId) {
      receiver = await Customer.findOne({ id: receiverId });
    } else if (receiverPhone) {
      receiver = await Customer.findOne({ phone: receiverPhone });
    }

    if (!receiver) {
      throw new Error('RECEIVER_NOT_FOUND');
    }

    if (receiver.status !== 'ACTIVE') {
      throw new Error('RECEIVER_NOT_ACTIVE');
    }
  },

  async validateBillOwner(trail) {
    const { billerId, billCode } = trail.inputMessage.transBody;

    if (!billerId || !billCode) {
      throw new Error('BILL_INFO_REQUIRED');
    }

    const bill = await Bill.findOne({ biller: billerId, billCode });

    if (!bill) {
      throw new Error('BILL_OWNER_INVALID');
    }

    if (bill.status === 'paid') {
      throw new Error('BILL_ALREADY_PAID');
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

validateTransaction.validatePocketChecksum =
  validateFuncs.validatePocketChecksum;
validateTransaction.validateFuncs = validateFuncs;

module.exports = validateTransaction;
