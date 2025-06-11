import { message, TOKEN_TYPES } from "../common/constants/index.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/response/index.js";
import { verifyToken } from "../utils/security/index.js";
import * as dbService from '../database/db.service.js';
import { userModel } from "../database/model/index.js";
export const authGraphMiddleware = async ({ authorization, tokenType = TOKEN_TYPES.ACCESS } = {}) => {
  const [bearer, token] = authorization?.split(' ') || [];

  if (!bearer || !token) {
    throw new AppError(message.user.Unauthorize, 401);
  }


  let access_signature = bearer === 'Bearer' ? process.env.USER_ACCESS_TOKEN : process.env.ADMIN_ACCESS_TOKEN
  let refresh_signature = bearer === 'Bearer' ? process.env.USER_REFRESH_TOKEN : process.env.ADMIN_REFRESH_TOKEN


  const decoded = verifyToken({ token, signature: tokenType === TOKEN_TYPES.ACCESS ? access_signature : refresh_signature });

  if (!decoded) {
    throw new AppError(message.user.Unauthorize, 401);
  }

  const user = await dbService.findOne({ model: userModel, filter: { _id: decoded.id } });

  if (!user) {
    throw new AppError(message.user.NotFound, 404);
  }

  if (user.changeCredentialTime?.getTime() > decoded.iat * 1000) {
    throw new AppError(message.user.Unauthorize, 401);
  }

  return user;

};

export const authorizationGraphMiddleware = (roles = [], role) => {

  if (!roles.includes(role)) {
    throw new AppError(message.user.Forbidden, 403);
  }
  return true;

}