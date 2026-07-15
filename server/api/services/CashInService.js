module.exports = {
  request: async (body) => {
    const { receiverPhone, amount, serviceCode } = body;

    if (!receiverPhone) {
      throw new Error('Số điện thoại người nhận là bắt buộc');
    }

    if (!amount || amount <= 0) {
      throw new Error('Số tiền không hợp lệ');
    }

    // Tìm service theo code
    const service = await sails.models.service.findOne({
      code: serviceCode,
      type: 'cash-in',
    });

    if (!service) {
      throw new Error('Không tìm thấy dịch vụ nạp tiền');
    }

    // Tính phí
    let fee = 0;

    if (service.feeType === 'fixed') {
      fee = service.feeValue;
    } else if (service.feeType === 'percent') {
      fee = (amount * service.feeValue) / 100;

      if (service.feeMax && fee > service.feeMax) {
        fee = service.feeMax;
      }

      if (service.feeMin && fee < service.feeMin) {
        fee = service.feeMin;
      }
    }

    // Tìm customer theo số điện thoại
    const receiver = await sails.models.customer.findOne({
      phone: receiverPhone,
    });

    if (!receiver) {
      throw new Error('Không tìm thấy người nhận');
    }

    // Tìm ví của người nhận
    const receiverPocket = await sails.models.pocket.findOne({
      owner: receiver.id,
    });

    if (!receiverPocket) {
      throw new Error('Không tìm thấy ví của người nhận');
    }

    // Tìm ví system để làm sender (admin nạp tiền từ system)
    const systemPocket = await sails.models.pocket.findOne({ type: 'system' });

    if (!systemPocket) {
      throw new Error('Không tìm thấy ví hệ thống');
    }

    // Tạo transaction trail
    const trail = await sails.models.transactiontrail
      .create({
        service: service.id,
        inputMessage: {
          transBody: {
            receiverPhone,
            amount,
            senderPocketId: systemPocket.id,
            receiverPocketId: receiverPocket.id,
            serviceCode,
          },
          header: { type: 'cash-in', serviceCode },
        },
        outputMessage: { transBody: {} },
        authMethod: service.authMethod,
      })
      .fetch();

    const transRefId = trail.id;
    const totalAmount = amount + fee;

    // Update trail với thông tin transaction
    await sails.models.transactiontrail.updateOne({ id: trail.id }).set({
      outputMessage: {
        transBody: {
          transRefId,
          amount,
          fee,
          totalAmount,
        },
      },
      status: 'pending',
      transStepLog: [
        {
          step: 1,
          status: 'pending',
          message: 'Yêu cầu nạp tiền thành công',
          createdAt: new Date(),
        },
      ],
    });

    return {
      transRefId,
      amount,
      fee,
      totalAmount,
      receiverName: receiver.name,
      receiverPhone: receiver.phone,
      serviceName: service.name,
    };
  },

  confirm: async (body) => {
    const { transRefId } = body;

    const trail = await sails.models.transactiontrail.findOne({
      id: transRefId,
    });

    if (!trail) {
      throw new Error('Không tìm thấy giao dịch');
    }

    if (trail.status !== 'pending') {
      throw new Error('Trạng thái giao dịch không hợp lệ');
    }

    const { senderPocketId, receiverPocketId, amount } =
      trail.inputMessage.transBody;

    // Lock sender pocket (system pocket)
    const senderPocket = await sails.models.pocket.findOne({
      id: senderPocketId,
    });

    if (!senderPocket) {
      throw new Error('Không tìm thấy ví hệ thống');
    }

    if (senderPocket.state !== 'available') {
      throw new Error('Ví hệ thống đang bị khóa');
    }

    // Lock receiver pocket
    const receiverPocket = await sails.models.pocket.findOne({
      id: receiverPocketId,
    });

    if (!receiverPocket) {
      throw new Error('Không tìm thấy ví người nhận');
    }

    if (receiverPocket.state !== 'available') {
      throw new Error('Ví người nhận đang bị khóa');
    }

    try {
      // Lock pockets
      await sails.models.pocket.updateOne({ id: senderPocketId }).set({
        state: 'inProgress',
      });
      await sails.models.pocket.updateOne({ id: receiverPocketId }).set({
        state: 'inProgress',
      });

      // Execute transaction
      const fee = trail.outputMessage.transBody.fee || 0;
      const totalAmount = amount + fee;

      // Trừ tiền từ system pocket
      await sails.models.pocket.updateOne({ id: senderPocketId }).set({
        balance: senderPocket.balance - totalAmount,
      });

      // Cộng tiền vào receiver pocket
      await sails.models.pocket.updateOne({ id: receiverPocketId }).set({
        balance: receiverPocket.balance + amount,
      });

      // Tạo transaction record
      const transaction = await sails.models.transaction
        .create({
          transRefId,
          service: trail.service,
          senderPocket: senderPocketId,
          receiverPocket: receiverPocketId,
          amount,
          fee,
          totalAmount,
          status: 'done',
          type: 'cash-in',
          message: 'Nạp tiền thành công',
        })
        .fetch();

      // Release pockets
      await sails.models.pocket.updateOne({ id: senderPocketId }).set({
        state: 'available',
      });
      await sails.models.pocket.updateOne({ id: receiverPocketId }).set({
        state: 'available',
      });

      // Update trail
      await sails.models.transactiontrail.updateOne({ id: trail.id }).set({
        status: 'done',
        transStepLog: [
          ...trail.transStepLog,
          {
            step: 2,
            status: 'done',
            message: 'Nạp tiền thành công',
            createdAt: new Date(),
          },
        ],
      });

      return {
        transRefId,
        transaction,
      };
    } catch (error) {
      // Release pockets on error
      await sails.models.pocket.updateOne({ id: senderPocketId }).set({
        state: 'available',
      });
      await sails.models.pocket.updateOne({ id: receiverPocketId }).set({
        state: 'available',
      });

      // Update trail to failed
      await sails.models.transactiontrail.updateOne({ id: trail.id }).set({
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
  },

  getHistory: async () => {
    const transactions = await sails.models.transaction
      .find({ type: 'cash-in' })
      .sort('createdAt DESC')
      .populate('senderPocket')
      .populate('receiverPocket')
      .populate('service');

    // Populate owner information
    const pocketIds = [
      ...transactions.map((t) => t.senderPocket && t.senderPocket.id),
      ...transactions.map((t) => t.receiverPocket && t.receiverPocket.id),
    ].filter(Boolean);

    const pockets = await sails.models.pocket
      .find({ id: pocketIds })
      .populate('owner');
    const pocketMap = {};
    pockets.forEach((p) => {
      pocketMap[p.id] = p;
    });

    return transactions.map((t) => ({
      ...t,
      senderPocket: pocketMap[t.senderPocket] || null,
      receiverPocket: pocketMap[t.receiverPocket] || null,
    }));
  },

  getServices: async () => {
    const services = await sails.models.service.find({
      type: 'cash-in',
      status: true,
    });

    return services;
  },
};
