module.exports.custom = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  checksumSecret: process.env.CHECKSUM_SECRET || 'secret',
};
