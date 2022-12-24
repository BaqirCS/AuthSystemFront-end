class CustomError extends Error {
  constructor(msg, status) {
    super();
    this.message = msg;
    this.statusCode = status;
  }
}

module.exports = CustomError;
