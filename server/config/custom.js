module.exports.custom = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  checksumSecret: process.env.CHECKSUM_SECRET || 'secret',
  phoneNumberRegex: process.env.PHONE_NUMBER_REGEX || '',
  // '^(?:\\+84|84|0)(?:3|5|7|8|9)\\d{8}$',
};
