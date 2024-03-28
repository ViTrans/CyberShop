const shopModel = require("../models/shop.model");
const bycrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    // check xem token đã được sử dụng chưa
    const foundToken = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // nếu có thì xóa token
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log("userId", userId);
      console.log("email", email);
      // xóa token
      await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Token has been used");
    }

    // nếu chưa thì tạo token mới
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("Token not found");
    }
    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    // check xem token có hợp lệ không
    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError("Email not found");
    }
    // tạo token mới
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // lưu token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log("delKey", delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Email not found");
    }
    const isMatch = await bycrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new AuthFailureError("Password is incorrect");
    }
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      publicKey,
      privateKey
    );

    await keyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email", "roles"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    // check email
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Email already exists");
    }
    // hash password
    const passwordHash = await bycrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ConflictRequestError("Create key token failed");
      }
      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email", "roles"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    // return error
    throw new ConflictRequestError("Sign up failed");
  };
}

module.exports = AccessService;
