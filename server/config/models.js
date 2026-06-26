module.exports.models = {
  schema: true,

  migrate: 'alter',

  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true },
    id: { type: 'string', columnName: '_id' },
  },

  dataEncryptionKeys: {
    default:
      process.env.DATA_ENCRYPTION_KEY ||
      'Rgq6oZu/viZXZZkSau9Jhaf8S3Iw8aS/5YomR2QRsDU=',
  },

  cascadeOnDestroy: true,
};
