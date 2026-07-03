// module.exports.bootstrap = async function () {
//   global.HttpResponses = require('../api/constants/HttpResponses');

const { generateChecksum } = require('../api/services/PocketService');

// };
module.exports.bootstrap = async function (done) {
  global.HttpResponses = require('../api/constants/HttpResponses');
  // Đã có thì bỏ qua
  // let service = await Service.findOne({ code: 'P2P' });

  // if (service) {
  //   return done();
  // }

  // Xóa hết các bảng
  await Promise.all([
    FieldBuilder.destroy({}),
    TransField.destroy({}),
    TransValidation.destroy({}),
    TransDefinition.destroy({}),
    TransactionTrail.destroy({}),
    PocketEntry.destroy({}),
    Transaction.destroy({}),
    Service.destroy({}),
  ]);

  service = await Service.create({
    code: 'P2P',
    name: 'Peer To Peer',
    authMethod: 'pin',

    feeType: 'fixed',
    feeValue: 100,

    status: true,
  }).fetch();

  //
  // ===========================
  // Field Builder
  // ===========================
  //

  await FieldBuilder.createEach([
    {
      service: service.id,
      order: 1,
      name: 'userId',
      rule: 'mapping',
      sourceField: 'senderId',
      dataType: 'string',
      required: true,
    },

    {
      service: service.id,
      order: 2,
      name: 'receiverPhone',
      rule: 'mapping',
      sourceField: 'receiverPhone',
      dataType: 'string',
    },

    {
      service: service.id,
      order: 3,
      name: 'amount',
      rule: 'mapping',
      sourceField: 'amount',
      dataType: 'number',
    },

    {
      service: service.id,
      order: 4,
      name: 'debitFee',
      rule: 'fixed',
      value: 100,
      dataType: 'number',
    },

    {
      service: service.id,
      order: 5,
      name: 'currency',
      rule: 'fixed',
      value: 'MMK',
      dataType: 'string',
    },

    {
      service: service.id,
      order: 6,
      name: 'sender',
      rule: 'query',
      query: 'queryUserById',
      queryFields: ['senderId'],
      columns: ['id', 'name', 'phone', 'role'],
      dataType: 'string',
    },

    {
      service: service.id,
      order: 7,
      name: 'receiver',
      rule: 'query',
      query: 'queryUserByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'name', 'phone', 'role'],
      dataType: 'string',
    },

    {
      service: service.id,
      order: 8,
      name: 'senderPocket',
      rule: 'query',
      query: 'queryPocketByUserId',
      queryFields: ['senderId'],
      columns: ['id', 'balance'],
      dataType: 'string',
    },

    {
      service: service.id,
      order: 9,
      name: 'receiverPocket',
      rule: 'query',
      query: 'queryPocketByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'balance'],
      dataType: 'string',
    },
  ]);

  //
  // ===========================
  // TransField
  // ===========================
  //

  await TransField.createEach([
    {
      service: service.id,
      order: 1,
      fieldName: 'userId',
      dataType: 'string',
    },

    {
      service: service.id,
      order: 2,
      fieldName: 'receiverPhone',
      dataType: 'string',
      regex: '^\\d{8,15}$',
    },

    {
      service: service.id,
      order: 3,
      fieldName: 'amount',
      dataType: 'number',
    },

    {
      service: service.id,
      order: 4,
      fieldName: 'currency',
      dataType: 'string',
    },

    {
      service: service.id,
      order: 5,
      fieldName: 'senderId',
      dataType: 'string',
    },

    {
      service: service.id,
      order: 6,
      fieldName: 'receiverId',
      dataType: 'string',
    },
  ]);

  //
  // ===========================
  // Business Validation
  // ===========================
  //

  await TransValidation.createEach([
    {
      service: service.id,
      order: 1,
      validateFunc: 'validateReceiverIsNotSender',
      validateFields: 'senderId:receiverId',
      errorCode: 'RECEIVER_IS_SENDER',
    },

    {
      service: service.id,
      order: 2,
      validateFunc: 'validateSenderAccountSufficiency',
      validateFields: 'senderId:amount:debitFee',
      errorCode: 'INSUFFICIENT_BALANCE',
    },
  ]);

  //
  // ===========================
  // GL Definition
  // ===========================
  //
  await TransDefinition.create({
    service: service.id,
    glSteps: [
      {
        order: 1,
        amount: 'amount',
        debit: {
          level: 'productLevel',
          target: 'senderPocketId',
        },
        credit: {
          level: 'productLevel',
          target: 'receiverPocketId',
        },
      },
      {
        order: 2,
        amount: 'debitFee',
        debit: {
          level: 'productLevel',
          target: 'senderPocketId',
        },
        credit: {
          level: 'wallet',
          target: 'system',
        },
      },
    ],
  });

  // create system pocket nếu chưa có
  const systemPocket = await Pocket.findOne({
    type: 'system',
  });

  if (!systemPocket) {
    await Pocket.create({
      type: 'system',
      balance: 1000000,
      checksum: generateChecksum({
        owner: null,
        type: 'system',
        currency: 'VND',
        balance: 1000000,
      }),
    });
  }

  done();
};
