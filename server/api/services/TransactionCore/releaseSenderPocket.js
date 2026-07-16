module.exports = async (pocketId) => {
  await Pocket.updateOne({ id: pocketId }).set({
    state: 'available',
  });
};
