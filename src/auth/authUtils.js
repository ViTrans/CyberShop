const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError } = require("../core/error.response");
const keyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(err);
      }
      console.log("decoded", decoded);
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Unauthorized user");
  }
  const keyStore = await keyTokenService.findByUserId(userId);

  console.log("keyStore", keyStore);
  if (!keyStore) throw new NotFoundError("Key not found");

  const accessToken = req.headers["authorization"];
  console.log("accessToken", accessToken);
  if (!accessToken) throw new AuthFailureError("Unauthorized");
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Unauthorized");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  try {
    const decoded = jwt.verify(token, keySecret);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
