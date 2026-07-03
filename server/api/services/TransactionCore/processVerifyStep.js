const calculateFee = require('./calculateFee');
const executeTransaction = require('./executeTransaction');
const releaseSenderPocket = require('./releaseSenderPocket');
const validateStateAndLock = require('./validateStateAndLock');
const validateTransaction = require('./validateTransaction');
const verifyPINAsync = require('./verifyPINAsync');

module.exports = async (transInput) => {
  const transRefId = transInput.body.transRefId;

  const trail = await TransactionTrail.findOne({ id: transRefId });

  const senderId = trail.inputMessage.transBody.senderId;

  if (!trail) {
    throw new Error('Không tìm thấy nhật ký giao dịch.');
  }

  if (trail.status !== 'confirmed') {
    throw new Error('Trạng thái giao dịch không hợp lệ.');
  }

  // await validateStateAndLock(senderId);

  try {
    const authMethod = trail.authMethod;

    if (authMethod === 'pin') {
      await verifyPINAsync(transInput.user.id, transInput.body.pin);
    }

    // calculateFee({});

    // await validateTransaction({
    //   transBody,
    //   feeSnapshot,
    //   service,
    // });

    await executeTransaction(trail);

    // await releaseSenderPocket(senderId);

    // Cập nhật lại trạng thái giao dịch
    // await TransactionTrail.updateOne({ id: trail.id }).set({
    //   status: 'done',
    //   expiredAt: Date.now() + 1000 * 60 * 2,
    //   transStepLog: [
    //     ...trail.transStepLog,
    //     {
    //       step: 3,
    //       status: 'done',
    //       message: 'Giao dịch hoàn tất',
    //       createdAt: new Date(),
    //     },
    //   ],
    // });

    return { authMethod, transRefId };
  } catch (error) {
    await TransactionTrail.updateOne({ id: trail.id }).set({
      status: 'failed',
      transStepLog: [
        ...trail.transStepLog,
        {
          step: 2,
          status: 'failed',
          message: error.message,
          createdAt: new Date(),
        },
      ],
    });
    await releaseSenderPocket(senderId);
    throw error;
  }
};
