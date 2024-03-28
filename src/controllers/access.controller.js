const { SuccessResponse, Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      metaData: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metaData: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metaData: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new Created({
      message: "User created successfully",
      metaData: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
