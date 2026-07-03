const bcrypt = require('bcrypt');

module.exports = async (senderId, pin) => {
  const user = await Customer.findOne({ id: senderId });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(String(pin), user.pin);

  if (!isValid) {
    throw new Error('Sai mã PIN');
  }
};
