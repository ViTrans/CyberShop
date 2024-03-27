require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { countConnect, checkOverLoad } = require("./helpers/check.connect");

const app = express();

// init middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db

require("./dbs/init.mongodb");
countConnect();
// checkOverLoad();
// init routes

app.use("/", require("./routes"));

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.message,
    status: "error",
    code: statusCode,
  });
});

module.exports = app;
