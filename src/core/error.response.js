const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  AUTHTHORIZED: 401,
  NOT_FOUND: 404,
};

const ReasonStatusCode = {
  FORBIDDEN: "Forbidden",
  CONFLICT: "Conflict error",
  AUTHTHORIZED: "Unauthorized",
  NOT_FOUND: "Not Found",
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

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.AUTHTHORIZED,
    statusCode = StatusCode.AUTHTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
};
