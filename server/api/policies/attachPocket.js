module.exports = async function (req, res, next) {
  try {
    const pocketId = req.param('id');
    const pocket = await Pocket.findOne({ id: pocketId });

    if (!pocket) {
      return res.notFound({
        message: 'Không tìm thấy ví',
      });
    }

    req.pocket = pocket;

    return next();
  } catch (err) {
    sails.log.error(err);

    return res.serverError({
      message: 'Lỗi hệ thống',
    });
  }
};
