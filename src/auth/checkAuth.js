const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "Authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Unauthorized",
        status: "error",
      });
    }
    // check key
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Unauthorized",
        status: "error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

// check permission
const checkPermission = (permisstion) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Forbidden",
        status: "error",
      });
    }
    const isPermission = req.objKey.permissions.includes(permisstion);
    if (!isPermission) {
      return res.status(403).json({
        message: "Forbidden",
        status: "error",
      });
    }
    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  checkPermission,
  asyncHandler,
};
