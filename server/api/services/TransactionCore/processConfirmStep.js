module.exports = async (transInput) => {
  const transRefId = transInput.body.transRefId;

  const trail = await TransactionTrail.findOne({ id: transRefId });

  if (!trail) {
    throw new Error('Không tìm thấy nhật ký giao dịch.');
  }

  if (trail.status !== 'pending') {
    throw new Error('Trạng thái giao dịch không hợp lệ.');
  }

  try {
    const authMethod = trail.authMethod;

    // Cập nhật lại trạng thái giao dịch
    await TransactionTrail.updateOne({ id: trail.id }).set({
      status: 'confirmed',
      expiredAt: Date.now() + 1000 * 60 * 2,
      transStepLog: [
        ...trail.transStepLog,
        {
          step: 2,
          status: 'confirmed',
          message: 'Đã xác nhận giao dịch.',
          createdAt: new Date(),
        },
      ],
    });

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
    throw error;
  }
};
