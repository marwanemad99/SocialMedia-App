import { message, TOKEN_TYPES } from "../../common/constants/index.js";
import { AppError } from "../../utils/appError.js";
import * as dbService from "../../database/db.service.js";
import { userModel } from "../../database/model/index.js";
import { verifyToken } from "../../utils/security/index.js";
export const authSocketMiddleware = async (socket, next) => {
  const authorization = socket.handshake.auth.authorization;
  const [bearer, token] = authorization?.split(' ') || [];
  const tokenType = TOKEN_TYPES.ACCESS
  if (!bearer || !token) {
    return next(new AppError(message.user.Unauthorize, 401));
  }

  let access_signature = bearer === 'Bearer' ? process.env.USER_ACCESS_TOKEN : process.env.ADMIN_ACCESS_TOKEN
  let refresh_signature = bearer === 'Bearer' ? process.env.USER_REFRESH_TOKEN : process.env.ADMIN_REFRESH_TOKEN
  let decoded;
  try {
    decoded = verifyToken({ token, signature: tokenType === TOKEN_TYPES.ACCESS ? access_signature : refresh_signature });
  } catch (error) {
    return next(new AppError(message.user.Unauthorize, 401));
  }
  if (!decoded) {
    return next(new AppError(message.user.Unauthorize, 401));
  }

  const user = await dbService.findOne({ model: userModel, filter: { _id: decoded.id }, populate: [{ path: 'friends' }], lean: false });

  if (!user) {
    return next(new AppError(message.user.NotFound, 404));
  }

  socket.user = user;
  socket.id = user._id.toString();
  return next();
};