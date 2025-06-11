import jwt from 'jsonwebtoken';
import { message, TOKEN_TYPES } from '../../common/constants/index.js';
import { userModel } from '../../database/model/user.model.js';
import * as dbService from '../../database/db.service.js';
import { AppError } from '../appError.js';
export const generateToken = ({ payload = {}, signature = process.env.USER_ACCESS_TOKEN, expiresIn = process.env.EXPIRE_IN }) => {
  return jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) });
}

export const verifyToken = ({ token = "", signature = process.env.JWT_SECRET }) => {
  return jwt.verify(token, signature);
}

export const decodeToken = async ({ authorization, tokenType = TOKEN_TYPES.ACCESS, next }) => {
  const [bearer, token] = authorization?.split(' ') || [];

  if (!bearer || !token) {
    return next(new AppError(message.user.Unauthorize, 401));
  }

  let access_signature = bearer === 'Bearer' ? process.env.USER_ACCESS_TOKEN : process.env.ADMIN_ACCESS_TOKEN
  let refresh_signature = bearer === 'Bearer' ? process.env.USER_REFRESH_TOKEN : process.env.ADMIN_REFRESH_TOKEN

  const decoded = verifyToken({ token, signature: tokenType === TOKEN_TYPES.ACCESS ? access_signature : refresh_signature });

  if (!decoded) {
    return next(new AppError(message.user.Unauthorize, 401));
  }

  const user = await dbService.findOne({ model: userModel, filter: { _id: decoded.id }, lean: false });

  if (!user) {
    return next(new AppError(message.user.NotFound, 404));
  }

  if (user.changeCredentialTime?.getTime() > decoded.iat * 1000) {
    return next(new AppError(message.user.Unauthorize, 401));
  }

  return user;
};