// HttpError takes 2 arguments: message, errorCode
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add "message" property to every instance
    this.code = errorCode; // Add "code" proprety to every instance
  }
}

module.exports = HttpError;
