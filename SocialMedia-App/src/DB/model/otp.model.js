import mongoose, { Schema, model } from "mongoose";
import { OTP_TYPES } from "../../common/constants/index.js";

export const OtpSchema = new Schema({
  otp: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: OTP_TYPES
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  failedAttempts: {
    type: Number,
    default: 0,
  },
  banExpiresAt: {
    type: Date,
  },
}, { timestamps: true })

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const OTPModel = mongoose.models.OTP || model('OTP', OtpSchema);
