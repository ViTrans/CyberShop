const express = require("express");
const { apiKey, checkPermission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(checkPermission("0000"));

router.use("/api/v1", require("./access"));

module.exports = router;
