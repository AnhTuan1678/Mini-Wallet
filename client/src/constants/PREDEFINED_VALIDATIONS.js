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
  {
    validateFunc: 'validatePocketChecksum',
    validateFields: 'senderPocketId:receiverPocketId',
    errorCode: 'INVALID_POCKET_CHECKSUM',
    description: 'Kiểm tra checksum của ví người gửi/người nhận',
  },
  {
    validateFunc: 'validatePIN',
    validateFields: 'senderId:pin',
    errorCode: 'INVALID_PIN',
    description: 'Xác thực mã PIN của người gửi',
  },
  {
    validateFunc: 'validateAmountPositive',
    validateFields: 'amount',
    errorCode: 'AMOUNT_MUST_BE_POSITIVE',
    description: 'Số tiền phải là số dương',
  },
  {
    validateFunc: 'validateCustomerActive',
    validateFields: 'senderId',
    errorCode: 'CUSTOMER_NOT_ACTIVE',
    description: 'Người gửi phải đang hoạt động',
  },
  {
    validateFunc: 'validateReceiverActive',
    validateFields: 'receiverId:receiverPhone',
    errorCode: 'RECEIVER_NOT_ACTIVE',
    description: 'Người nhận phải đang hoạt động',
  },
  {
    validateFunc: 'validateBillOwner',
    validateFields: 'billerId:billCode',
    errorCode: 'BILL_OWNER_INVALID',
    description: 'Hóa đơn phải thuộc nhà cung cấp đã chọn và chưa thanh toán',
  },
  {
    validateFunc: 'validateReceiverExists',
    validateFields: 'receiverPhone',
    errorCode: 'RECEIVER_NOT_FOUND',
    description: 'Người nhận phải tồn tại',
  },
  {
    validateFunc: 'validateReceiverPocketExists',
    validateFields: 'receiverPhone',
    errorCode: 'RECEIVER_POCKET_NOT_FOUND',
    description: 'Ví của người nhận phải tồn tại',
  },
];
