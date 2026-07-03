module.exports = async (senderId) => {
  await Pocket.updateOne({ owner: senderId }).set({
    state: 'available',
  });
};
