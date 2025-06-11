import mongoose from "mongoose";
import { message } from "../common/constants/index.js";
import { AppError } from "../utils/appError.js";

/**
 * Middleware to validate multiple MongoDB ObjectId parameters in req.params
 * @param {string[]} paramNames - Array of parameter names to validate
 */
export const validateMongoId = (...paramNames) => (req, res, next) => {
  for (const paramName of paramNames) {
    if (req.params[paramName] && !mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return next(new AppError(`${message.INVALID_OBJECT_ID}: ${paramName}`, 400));
    }
  }
  next();
};
