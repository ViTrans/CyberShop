const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  CREATED: "Created",
  OK: "Ok",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metaData = {}
  ) {
    this.message = !message ? ReasonStatusCode.OK : message;
    this.status = statusCode;
    this.metaData = metaData;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}
class OK extends SuccessResponse {
  constructor(message, metaData) {
    super(message, StatusCode.OK, ReasonStatusCode.OK, metaData); // call the parent constructor
  }
}

class Created extends SuccessResponse {
  constructor(
    options,
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metaData = {}
  ) {
    super(message, statusCode, reasonStatusCode, metaData);
    this.options = options;
  }
}

module.exports = {
  Created,
  OK,
};
