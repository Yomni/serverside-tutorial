const { STATUS_CODE } = require('./constants');

const commonErrorHandler = (err, req, res, next) => {
  console.error(err);
  res.sendStatus(STATUS_CODE.BAD_REQUEST);
};

module.exports = {
  commonErrorHandler
};
