export const PREDEFINED_VALIDATIONS = [
  {
    validateFunc: 'validateReceiverIsNotSender',
    validateFields: 'senderId:receiverId',
    errorCode: 'RECEIVER_IS_SENDER',
    description: 'Người nhận không được là người gửi',
  },
  {
    validateFunc: 'validateSenderAccountSufficiency',
    validateFields: 'senderId:amount',
    errorCode: 'INSUFFICIENT_BALANCE',
    description: 'Tài khoản người gửi đủ số dư',
  },
];