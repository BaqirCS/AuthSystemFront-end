const notFound = (req, res, next) => {
  return res
    .status(404)
    .json({ msg: 'there is no such resource, please check your request' });
};
const ErrorHandler = (error, req, res, next) => {
  let customError = {
    status: error.status ? error.status : 500,
    msg: error.message ? error.message : 'Internal Server Error',
  };
  if (error.statusCode) {
    customError.status = error.statusCode;
  }
  res.status(customError.status).json(customError.msg);
};

module.exports = { notFound, ErrorHandler };
