// module.exports.bootstrap = async function () {
//   global.HttpResponses = require('../api/constants/HttpResponses');

const { generateChecksum } = require('../api/services/PocketService');
const buildDefaultGlSteps = require('../api/services/buildDefaultGlSteps');

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
    type: 'transfer',
    authMethod: 'pin',

    feeType: 'fixed',
    feeValue: 100,

    status: true,
  }).fetch();

  // Create default cash-in services
  const cashInService1 = await Service.create({
    code: 'CASHIN_FREE',
    name: 'Nạp tiền miễn phí',
    type: 'cash-in',
    authMethod: 'none',

    feeType: 'fixed',
    feeValue: 0,

    status: true,
  }).fetch();

  // Create field builders for cash-in service 1
  await FieldBuilder.createEach([
    {
      service: cashInService1.id,
      order: 1,
      code: 'receiverPhone',
      name: 'Số điện thoại người nhận',
      rule: 'mapping',
      sourceField: 'receiverPhone',
      dataType: 'string',
      isRequired: true,
    },
    {
      service: cashInService1.id,
      order: 2,
      code: 'amount',
      name: 'Số tiền',
      rule: 'mapping',
      sourceField: 'amount',
      dataType: 'number',
      isRequired: true,
    },
    {
      service: cashInService1.id,
      order: 3,
      code: 'senderPocket',
      name: 'Ví ngân hàng (sender)',
      rule: 'query',
      query: 'queryBankPocket',
      queryFields: [],
      columns: ['id'],
      dataType: 'string',
      isRequired: false,
    },
    {
      service: cashInService1.id,
      order: 4,
      code: 'receiver',
      name: 'Người nhận',
      rule: 'query',
      query: 'queryUserByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'name', 'phone', 'role'],
      dataType: 'string',
      isRequired: false,
    },
    {
      service: cashInService1.id,
      order: 5,
      code: 'receiverPocket',
      name: 'Ví của người nhận',
      rule: 'query',
      query: 'queryPocketByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'balance'],
      dataType: 'string',
      isRequired: false,
    },
  ]);

  const cashInService2 = await Service.create({
    code: 'CASHIN_FEE',
    name: 'Nạp tiền có phí',
    type: 'cash-in',
    authMethod: 'none',

    feeType: 'fixed',
    feeValue: 5000,

    status: true,
  }).fetch();

  // Create field builders for cash-in service 2
  await FieldBuilder.createEach([
    {
      service: cashInService2.id,
      order: 1,
      code: 'receiverPhone',
      name: 'Số điện thoại người nhận',
      rule: 'mapping',
      sourceField: 'receiverPhone',
      dataType: 'string',
      isRequired: true,
    },
    {
      service: cashInService2.id,
      order: 2,
      code: 'amount',
      name: 'Số tiền',
      rule: 'mapping',
      sourceField: 'amount',
      dataType: 'number',
      isRequired: true,
    },
    {
      service: cashInService2.id,
      order: 3,
      code: 'senderPocket',
      name: 'Ví ngân hàng (sender)',
      rule: 'query',
      query: 'queryBankPocket',
      queryFields: [],
      columns: ['id'],
      dataType: 'string',
      isRequired: false,
    },
    {
      service: cashInService2.id,
      order: 4,
      code: 'fee',
      name: 'Phí giao dịch',
      rule: 'fixed',
      value: 5000,
      dataType: 'number',
      isRequired: false,
    },
    {
      service: cashInService2.id,
      order: 5,
      code: 'receiver',
      name: 'Người nhận',
      rule: 'query',
      query: 'queryUserByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'name', 'phone', 'role'],
      dataType: 'string',
      isRequired: false,
    },
    {
      service: cashInService2.id,
      order: 6,
      code: 'receiverPocket',
      name: 'Ví của người nhận',
      rule: 'query',
      query: 'queryPocketByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'balance'],
      dataType: 'string',
      isRequired: false,
    },
  ]);

  //
  // ===========================
  // Field Builder
  // ===========================
  //

  await FieldBuilder.createEach([
    {
      service: service.id,
      order: 1,
      code: 'userId',
      name: 'Id người gửi',
      rule: 'mapping',
      sourceField: 'senderId',
      dataType: 'string',
      isRequired: false,
    },

    {
      service: service.id,
      order: 2,
      code: 'receiverPhone',
      name: 'Số điện thoại người nhận',
      rule: 'mapping',
      sourceField: 'receiverPhone',
      dataType: 'string',
      isRequired: true,
    },

    {
      service: service.id,
      order: 3,
      code: 'amount',
      name: 'Số tiền',
      rule: 'mapping',
      sourceField: 'amount',
      dataType: 'number',
      isRequired: true,
    },

    {
      service: service.id,
      order: 4,
      code: 'debitFee',
      name: 'Phí gạch nợ',
      rule: 'fixed',
      value: 100,
      dataType: 'number',
      isRequired: false,
    },

    {
      service: service.id,
      order: 5,
      code: 'currency',
      name: 'Đơn vị tiền tệ',
      rule: 'fixed',
      value: 'MMK',
      dataType: 'string',
      isRequired: false,
    },

    {
      service: service.id,
      order: 6,
      code: 'sender',
      name: 'Người gửi',
      rule: 'query',
      query: 'queryUserById',
      queryFields: ['senderId'],
      columns: ['id', 'name', 'phone', 'role'],
      dataType: 'string',
      isRequired: false,
    },

    {
      service: service.id,
      order: 7,
      code: 'receiver',
      name: 'Người nhận',
      rule: 'query',
      query: 'queryUserByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'name', 'phone', 'role'],
      dataType: 'string',
      isRequired: false,
    },

    {
      service: service.id,
      order: 8,
      code: 'senderPocket',
      name: 'Ví của người gửi',
      rule: 'query',
      query: 'queryPocketByUserId',
      queryFields: ['senderId'],
      columns: ['id', 'balance'],
      dataType: 'string',
      isRequired: false,
    },

    {
      service: service.id,
      order: 9,
      code: 'receiverPocket',
      name: 'Ví của người nhận',
      rule: 'query',
      query: 'queryPocketByPhone',
      queryFields: ['receiverPhone'],
      columns: ['id', 'balance'],
      dataType: 'string',
      isRequired: false,
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
      code: 'receiverPhone',
      name: 'Số điện thoại người nhận',
      dataType: 'string',
      regex: sails.config.custom.phoneNumberRegex,
      isRequired: true,
    },

    {
      service: service.id,
      order: 2,
      code: 'amount',
      name: 'Số tiền',
      dataType: 'number',
      isRequired: true,
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
    glSteps: buildDefaultGlSteps(service.type, service.feeValue),
  });

  //
  // ===========================
  // Cash-in Service Configuration
  // ===========================
  //

  // TransField for cash-in services
  await TransField.createEach([
    {
      service: cashInService1.id,
      order: 1,
      code: 'receiverPhone',
      name: 'Số điện thoại người nhận',
      dataType: 'string',
      regex: sails.config.custom.phoneNumberRegex,
      isRequired: true,
    },
    {
      service: cashInService1.id,
      order: 2,
      code: 'amount',
      name: 'Số tiền',
      dataType: 'number',
      isRequired: true,
    },
  ]);

  await TransField.createEach([
    {
      service: cashInService2.id,
      order: 1,
      code: 'receiverPhone',
      name: 'Số điện thoại người nhận',
      dataType: 'string',
      regex: sails.config.custom.phoneNumberRegex,
      isRequired: true,
    },
    {
      service: cashInService2.id,
      order: 2,
      code: 'amount',
      name: 'Số tiền',
      dataType: 'number',
      isRequired: true,
    },
  ]);

  // TransValidation for cash-in services
  await TransValidation.createEach([
    {
      service: cashInService1.id,
      order: 1,
      validateFunc: 'validateReceiverExists',
      validateFields: 'receiverPhone',
      errorCode: 'RECEIVER_NOT_FOUND',
    },
    {
      service: cashInService1.id,
      order: 2,
      validateFunc: 'validateReceiverPocketExists',
      validateFields: 'receiverPhone',
      errorCode: 'RECEIVER_POCKET_NOT_FOUND',
    },
  ]);

  await TransValidation.createEach([
    {
      service: cashInService2.id,
      order: 1,
      validateFunc: 'validateReceiverExists',
      validateFields: 'receiverPhone',
      errorCode: 'RECEIVER_NOT_FOUND',
    },
    {
      service: cashInService2.id,
      order: 2,
      validateFunc: 'validateReceiverPocketExists',
      validateFields: 'receiverPhone',
      errorCode: 'RECEIVER_POCKET_NOT_FOUND',
    },
  ]);

  // TransDefinition for cash-in services
  await TransDefinition.create({
    service: cashInService1.id,
    glSteps: buildDefaultGlSteps(cashInService1.type, cashInService1.feeValue),
  });

  await TransDefinition.create({
    service: cashInService2.id,
    glSteps: buildDefaultGlSteps(cashInService2.type, cashInService2.feeValue),
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

  // create bank pocket nếu chưa có
  const bankPocket = await Pocket.findOne({
    type: 'bank',
  });

  if (!bankPocket) {
    await Pocket.create({
      type: 'bank',
      balance: 1000000000000000000000, // 1 triệu tỷ VND
      checksum: generateChecksum({
        owner: null,
        type: 'bank',
        currency: 'VND',
        balance: 1000000000000000000000,
      }),
    });
  }

  // Tạo 1 tài khoản admin nếu chưa có
  const admin = await Customer.findOne({
    role: 'admin',
  });
  const bcrypt = require('bcrypt');

  if (!admin) {
    await Customer.create({
      phone: 'admin',
      email: 'admin@example.com',
      name: 'Admin',
      password: bcrypt.hashSync('1', 10),
      pin: bcrypt.hashSync('1', 10),
      role: 'admin',
    }).fetch();
  }

  done();
};
