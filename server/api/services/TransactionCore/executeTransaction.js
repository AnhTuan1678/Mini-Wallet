const ObjectId = require('mongodb').ObjectId;

module.exports = async (trail) => {
  const transDefinition = await TransDefinition.findOne({
    service: trail.service,
  });

  if (!transDefinition) {
    throw new Error('Không tìm thấy định nghĩa nghiệp vụ.');
  }

  const transBody = trail.inputMessage.transBody;

  const variables = {
    ...transBody,
    debitFee: trail.feeSnapshot,
  };

  const glSteps = [...transDefinition.glSteps].sort(
    (a, b) => a.order - b.order
  );

  const client = Pocket.getDatastore().manager.client;
  const collection = Pocket.getDatastore().manager.collection(Pocket.tableName);

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      for (const step of glSteps) {
        const amount = variables[step.amount];

        if (!amount) {
          continue;
        }

        const debitPocketId = await resolvePocket(step.debit, variables);
        const creditPocketId = await resolvePocket(step.credit, variables);

        const debitResult = await collection.findOneAndUpdate(
          {
            _id: new ObjectId(debitPocketId),
            balance: { $gte: amount },
          },
          {
            $inc: {
              balance: -amount,
            },
          },
          {
            session,
            returnDocument: 'after',
          }
        );

        if (!debitResult) {
          throw new Error('Số dư không đủ.');
        }

        await collection.findOneAndUpdate(
          {
            _id: new ObjectId(creditPocketId),
          },
          {
            $inc: {
              balance: amount,
            },
          },
          {
            session,
            returnDocument: 'after',
          }
        );

        await PocketEntry.create({
          transRefId: trail.id,
          stepOrder: step.order,
          debit: debitPocketId,
          credit: creditPocketId,
          amount,
          status: 'settled',
        }).usingConnection(session);
      }

      const transaction = await Transaction.create({
        transRefId: trail.id,
        service: trail.service,
        // sender: transBody.senderId,
        // receiver: transBody.receiverId,
        senderPocket: transBody.senderPocket,
        receiverPocket: transBody.receiverPocket,
        amount: transBody.amount,
        fee: trail.feeSnapshot,
        totalAmount: transBody.amount + trail.feeSnapshot,
        status: 'done',
      })
        .usingConnection(session)
        .fetch();

      return transaction;
    });
  } finally {
    await session.endSession();
  }
};

async function resolvePocket(config, variables) {
  switch (config.level) {
    case 'productLevel':
      return variables[config.target];

    case 'wallet': {
      const pocket = await Pocket.findOne({
        code: config.target,
      });

      if (!pocket) {
        throw new Error(`Wallet ${config.target} không tồn tại.`);
      }

      return pocket.id;
    }

    default:
      throw new Error(`Level ${config.level} không hỗ trợ.`);
  }
}
