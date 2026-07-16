// Mock biller nội bộ để demo/integration test. Service thật vẫn gọi URL cấu hình trên Biller.
module.exports = {
  async inquiry(req, res) {
    const bill = await Bill.findOne({
      biller: req.body.billerId,
      billCode: req.body.billCode,
    });

    if (!bill) {
      return res.badRequest({ message: 'Không tìm thấy hóa đơn.' });
    }

    if (bill.status === 'paid') {
      return res.badRequest({ message: 'Hóa đơn đã được thanh toán.' });
    }

    return res.ok({ amount: bill.amount, billName: bill.name });
  },

  async payment(req, res) {
    const { billerId, billCode, transRefId, amount } = req.body;
    const bill = await Bill.findOne({ biller: billerId, billCode });

    if (!bill) {
      return res.badRequest({ message: 'Không tìm thấy hóa đơn.' });
    }

    if (Number(amount) !== bill.amount) {
      return res.badRequest({ message: 'Số tiền hóa đơn không khớp.' });
    }

    if (bill.status === 'paid' && bill.paidTransRefId !== transRefId) {
      return res.badRequest({ message: 'Hóa đơn đã được thanh toán.' });
    }

    if (bill.status !== 'paid') {
      await Bill.updateOne({ id: bill.id }).set({
        status: 'paid',
        paidTransRefId: transRefId,
      });
    }

    return res.ok({ success: true, billerReference: `BILL-${bill.id}` });
  },
};
