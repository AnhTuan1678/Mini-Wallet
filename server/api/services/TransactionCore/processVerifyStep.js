const executeTransaction = require('./executeTransaction');
const releaseSenderPocket = require('./releaseSenderPocket');
const validateStateAndLock = require('./validateStateAndLock');
const validateTransaction = require('./validateTransaction');
const verifyPINAsync = require('./verifyPINAsync');
const BillPaymentService = require('../BillPaymentService');

module.exports = async (transInput) => {
  const transRefId = transInput.body.transRefId;

  if (!transRefId) {
    throw new Error('Mã tham chiếu giao dịch là bắt buộc.');
  }

  const trail = await TransactionTrail.findOne({ id: transRefId });

  if (!trail) {
    throw new Error('Không tìm thấy nhật ký giao dịch.');
  }

  const senderPocketId = trail.inputMessage.transBody.senderPocketId;

  if (trail.status !== 'confirmed') {
    throw new Error('Trạng thái giao dịch không hợp lệ.');
  }

  await validateStateAndLock(senderPocketId);

  try {
    const authMethod = trail.authMethod;

    if (authMethod === 'pin') {
      await verifyPINAsync(transInput.user.id, transInput.body.pin);
    }

    // const feeSnapshot = await calculateFee(trail.inputMessage.transBody);

    await validateTransaction({ trail });
    await validateTransaction.validatePocketChecksum(trail);

    const transBody = trail.inputMessage.transBody;

    if (trail.inputMessage.header.type === 'bill-payment') {
      const payment = await BillPaymentService.payment({
        billerId: transBody.billerId,
        billCode: transBody.billCode,
        transRefId: trail.id,
        amount: transBody.amount,
      });
      transBody.billerReference = payment.billerReference;
      await TransactionTrail.updateOne({ id: trail.id }).set({ inputMessage: { ...trail.inputMessage, transBody } });
    }

    const transaction = await executeTransaction(trail);

    // Cập nhật lại trạng thái giao dịch
    await TransactionTrail.updateOne({ id: trail.id }).set({
      status: 'done',
      transStepLog: [
        ...trail.transStepLog,
        {
          step: 3,
          status: 'done',
          message: 'Giao dịch hoàn tất',
          createdAt: new Date(),
        },
      ],
    });

    return { authMethod, transRefId, transaction };
  } catch (error) {
    // Nếu error là do PIN không hợp lệ, thì không cần release sender pocket
    if (error.message === 'Sai mã PIN') {
      // Tăng số lần nhập sai PIN
      await TransactionTrail.updateOne({ id: trail.id }).set({
        pinAttempts: (trail.pinAttempts || 0) + 1,
      });

      // Nếu số lần nhập sai PIN chưa đạt 3 lần, thì thoát
      if ((trail.pinAttempts || 0) + 1 < 3) {
        throw error;
      } else {
        error.message = 'Bạn đã nhập sai mã PIN quá 3 lần. Giao dịch bị hủy.';
      }
    }

    await TransactionTrail.updateOne({ id: trail.id }).set({
      status: 'failed',
      transStepLog: [
        ...trail.transStepLog,
        {
          step: 3,
          status: 'failed',
          message: error.message,
          createdAt: new Date(),
        },
      ],
    });
    throw error;
  } finally {
    await releaseSenderPocket(senderPocketId);
  }
};
