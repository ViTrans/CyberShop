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

module.exports = app;
