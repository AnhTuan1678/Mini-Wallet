module.exports = function ({ type, value = 0, max = Infinity, min = 0 }, amount) {
  if (!amount) {
    throw new Error('Amount is required');
  }

  const fee = type === 'percent' ? amount * value : Number(value);

  if (fee > max) {
    return max;
  }

  if (fee < min) {
    return min;
  }

  return fee;
};
