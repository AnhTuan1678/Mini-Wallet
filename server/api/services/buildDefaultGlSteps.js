/**
 * Tự động tạo glSteps mặc định dựa trên loại dịch vụ và cấu hình phí.
 *
 * @param {string} serviceType - Loại dịch vụ ('transfer', 'cash-in', ...)
 * @param {number} feeValue - Giá trị phí (0 = miễn phí)
 * @returns {Array} Mảng glSteps mặc định
 */
module.exports = function buildDefaultGlSteps(serviceType, feeValue) {
  const hasFee = feeValue > 0;

  switch (serviceType) {
    case 'cash-in': {
      const steps = [
        {
          order: 1,
          amount: 'amount',
          debit: { level: 'wallet', target: 'bank' },
          credit: { level: 'productLevel', target: 'receiverPocketId' },
        },
      ];

      if (hasFee) {
        steps.push({
          order: 2,
          amount: 'debitFee',
          debit: { level: 'productLevel', target: 'receiverPocketId' },
          credit: { level: 'wallet', target: 'system' },
        });
      }

      return steps;
    }

    case 'transfer':
    case 'bill-payment': {
      const steps = [
        {
          order: 1,
          amount: 'amount',
          debit: { level: 'productLevel', target: 'senderPocketId' },
          credit: { level: 'productLevel', target: 'receiverPocketId' },
        },
      ];

      if (hasFee) {
        steps.push({
          order: 2,
          amount: 'debitFee',
          debit: { level: 'productLevel', target: 'senderPocketId' },
          credit: { level: 'wallet', target: 'system' },
        });
      }

      return steps;
    }

    default:
      return [];
  }
};
