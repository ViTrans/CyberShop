const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: "Forbidden",
  CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message); // call the parent constructor
    this.status = status; // define the status code
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
