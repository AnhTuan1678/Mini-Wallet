const buildFields = require('./buildFields');
const calculateFee = require('./calculateFee');
const validateFields = require('./validateFields');
const validateTransaction = require('./validateTransaction');
const BillPaymentService = require('../BillPaymentService');

module.exports = async (transInput) => {
  const serviceCode = transInput.body.serviceCode || transInput.body.serverCode;

  if (!serviceCode) {
    throw new Error('Service code is required');
  }

  const service = await Service.findOne({
    code: serviceCode,
  });

  if (!service) {
    throw new Error('Service not found');
  }

  if (!service.status) {
    throw new Error('Dịch vụ đang tạm ngừng.');
  }

  const transBody = await buildFields({
    service,
    transInput,
  });

  const trail = await TransactionTrail.create({
    service: service.id,
    inputMessage: {
      transBody,
      header: { serviceCode: service.code, type: service.type },
    },
    outputMessage: { transBody: {} },
    authMethod: service.authMethod,
  }).fetch();

  try {
    await validateFields({ service, transBody });

    let biller = null;

    if (service.type === 'bill-payment' || service.action === 'billerTrans') {
      const inquiry = await BillPaymentService.inquiry({
        billerId: transBody.billerId,
        billCode: transBody.billCode,
        transRefId: trail.id,
      });
      transBody.amount = inquiry.amount;
      transBody.receiverPocketId = inquiry.biller.pocket;
      transBody.billerName = inquiry.biller.name;
      transBody.billName = inquiry.billName;
      biller = inquiry.biller;
      await TransactionTrail.updateOne({ id: trail.id }).set({
        inputMessage: { ...trail.inputMessage, transBody },
      });
    }

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
    const receiverWallet = transBody.receiverPocketId
      ? {
        id: transBody.receiverPocketId || null,
        type: transBody.receiverPocketType || null,
      }
      : null;
    trail.feeSnapshot = feeSnapshot; // Lưu lại phí tạm thời vào trail

    await validateTransaction({ trail });
    const outputMessage = {
      ...trail.outputMessage,
      transBody: {
        ...trail.outputMessage.transBody,
        transRefId: trail.id,
        amount: transBody.amount,
        fee: feeSnapshot,
        totalAmount,
        billCode: transBody.billCode || null,
        billerName: (biller && biller.name) || null,
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

    return {
      amount: transBody.amount,
      fee: feeSnapshot,
      totalAmount,
      transRefId: trail.id,
      receiverName: transBody.receiverName || null,
      receiverPhone: transBody.receiverPhone || null,
      receiverPocketId: transBody.receiverPocketId || null,
      receiverPocketType: transBody.receiverPocketType || null,
      receiverWallet,
      billCode: transBody.billCode || null,
      billerName: (biller && biller.name) || null,
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
