const buildFields = require('./buildFields');
const calculateFee = require('./calculateFee');
const validateFields = require('./validateFields');
const validateTransaction = require('./validateTransaction');

module.exports = async (transInput) => {
  const service = await Service.findOne({
    code: transInput.body.serverCode,
  });

  if (!service) {
    throw new Error('Service not found');
  }

  const transBody = await buildFields({
    service,
    transInput,
  });

  const trail = await TransactionTrail.create({
    service: service.id,
    inputMessage: { transBody, header: { serviceCode: service.code } },
    outputMessage: { transBody: {} },
    authMethod: service.authMethod,
  }).fetch();

  // TODO: Xác thực logic
  try {
    await validateFields({ service, transBody });

    // TODO: Tính phí
    const feeSnapshot = calculateFee(
      {
        type: service.feeType,
        value: service.feeValue,
        max: service.feeMax,
        min: service.feeMin,
      },
      transBody.amount
    );
    const totalAmount = transBody.amount + feeSnapshot;

    await validateTransaction({
      transBody,
      feeSnapshot,
      service,
    });
    const outputMessage = {
      ...trail.outputMessage,
      transBody: {
        ...trail.outputMessage.transBody,
        transRefId: trail.id,
        amount: transBody.amount,
        fee: feeSnapshot,
        totalAmount,
      },
    };

    const transStepLog = [
      ...trail.transStepLog,
      {
        step: 1,
        status: 'pending',
        message: 'Yêu cầu giao dịch thành công',
        createdAt: new Date(),
      },
    ];

    // const expiredAt = Date.now() + 1000 * 60 * 5;

    await TransactionTrail.updateOne({ id: trail.id }).set({
      feeSnapshot,
      outputMessage,
      transStepLog,
      // expiredAt,
      status: 'pending',
    });

    // TODO: Trả về preview
    return {
      amount: transBody.amount,
      fee: feeSnapshot,
      totalAmount,
      transRefId: trail.id,
    };
  } catch (error) {
    await TransactionTrail.updateOne({
      id: trail.id,
    }).set({
      status: 'failed',
      transStepLog: [
        ...trail.transStepLog,
        {
          step: 1,
          status: 'failed',
          message: error.message,
          createdAt: new Date(),
        },
      ],
    });

    throw error;
  }
};
