import { message } from "../common/constants/index.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/response/index.js";
import { decodeToken } from "../utils/security/index.js";

export const authMiddleware = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    req.user = await decodeToken({ authorization, next });
    return next();
  });
};

export const authorizationMiddleware = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(message.user.Forbidden, 403));
    }
    return next();
  });
}