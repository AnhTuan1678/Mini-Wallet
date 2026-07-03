const { ObjectId } = require('mongodb');

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
  const collection = client.db().collection(Pocket.tableName);

  const session = client.startSession();

  try {
    const transaction = await session.withTransaction(async () => {
      for (const step of glSteps) {
        const amount = variables[step.amount];

        if (!amount) {
          continue;
        }

        const debitPocketId = await resolvePocket(step.debit, variables);
        const creditPocketId = await resolvePocket(step.credit, variables);

        const debitResult = await collection.updateOne(
          { _id: new ObjectId(debitPocketId), balance: { $gte: amount } },
          { $inc: { balance: -amount } },
          { session }
        );

        if (debitResult.modifiedCount !== 1) {
          throw new Error('Số dư không đủ.');
        }

        await collection.updateOne(
          { _id: new ObjectId(creditPocketId) },
          { $inc: { balance: amount } },
          { session }
        );

        await client.db().collection(PocketEntry.tableName).insertOne(
          {
            transRefId: trail.id,
            stepOrder: step.order,
            debit: debitPocketId,
            credit: creditPocketId,
            amount,
            status: 'settled',
          },
          { session }
        );
      }

      const transaction = {
        transRefId: trail.id,
        service: trail.service,
        senderPocket: transBody.senderPocketId,
        receiverPocket: transBody.receiverPocketId,
        amount: transBody.amount,
        fee: trail.feeSnapshot,
        totalAmount: transBody.amount + trail.feeSnapshot,
        status: 'done',
      };

      await client
        .db()
        .collection(Transaction.tableName)
        .insertOne(transaction, { session });

      return transaction;
    });

    return transaction;
  } catch (err) {
    throw new Error(`Giao dịch thất bại: ${err.message}`);
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
        type: config.target,
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
