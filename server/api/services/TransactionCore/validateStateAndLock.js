module.exports = async (senderId) => {
  const pocket = await Pocket.findOne({ owner: senderId });

  if (!pocket) {
    throw new Error('Không tìm thấy ví');
  }

  if (pocket.status === 'inactive') {
    throw new Error('Ví bị khoá');
  }

  if (pocket.state === 'inProgress') {
    throw new Error('Ví đang có giao dịch cần hoàn tất');
  }

  await Pocket.updateOne({ id: pocket.id }).set({
    state: 'inProgress',
  });

  return pocket;
};
