const BILLER_TIMEOUT_MS = 8000;

function extractData(payload) {
  return payload && typeof payload === 'object' && payload.data
    ? payload.data
    : payload;
}

async function callBiller(url, payload) {
  if (!url) {
    throw new Error('Biller chưa được cấu hình URL.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BILLER_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || 'Biller không thể xử lý yêu cầu.');
    }

    return extractData(body);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Kết nối biller quá thời gian chờ.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function getBiller(billerId) {
  if (!billerId) {
    throw new Error('Biller là bắt buộc.');
  }

  const biller = await Biller.findOne({ id: billerId, status: true });

  if (!biller) {
    throw new Error('Không tìm thấy hoặc biller đang ngừng hoạt động.');
  }

  return biller;
}

module.exports = {
  async inquiry({ billerId, billCode, transRefId }) {
    if (!billCode) {
      throw new Error('Mã hóa đơn là bắt buộc.');
    }

    const biller = await getBiller(billerId);
    const result = await callBiller(biller.inquiryUrl, {
      billerId: biller.id,
      billCode,
      transRefId,
    });
    const amount = Number(result.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Biller trả về số tiền hóa đơn không hợp lệ.');
    }

    return { biller, amount, billName: result.billName || null };
  },

  async payment({ billerId, billCode, transRefId, amount }) {
    const biller = await getBiller(billerId);
    const result = await callBiller(biller.paymentUrl, {
      billerId: biller.id,
      billCode,
      transRefId,
      amount,
    });

    if (result.success === false) {
      throw new Error(result.message || 'Biller từ chối thanh toán.');
    }

    return {
      biller,
      billerReference: result.billerReference || result.reference || null,
    };
  },
};
