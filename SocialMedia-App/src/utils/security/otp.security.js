import { customAlphabet } from "nanoid";
import * as dbService from "../../database/db.service.js";
import { message } from "../../common/constants/index.js";
import { AppError } from "../appError.js";
import { OTPModel } from "../../database/model/index.js"
import { compareHash, generateHash } from "./hash.security.js";
export const generateOtp = () => {
  return customAlphabet('1234567890', 4)();
}

const isOTPExpired = (expiresAt) => {
  return Date.now() > expiresAt;
};

const isUserBanned = (banExpiresAt) => {
  return banExpiresAt && Date.now() < banExpiresAt;
};


export const createOTP = async ({ email, type }) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  const hashOTP = generateHash({ plainText: otp });

  const otpRecord = await dbService.create({
    model: OTPModel,
    data: {
      otp: hashOTP,
      email,
      type,
      expiresAt
    }
  });

  return { otp, expiresAt };
};


export const validateOTP = async ({ email, code, type }) => {
  const otpRecord = await dbService.findOne(
    { model: OTPModel, filter: { email, type }, lean: false }
  );

  console.log(otpRecord);

  if (!otpRecord) {
    throw new AppError(message.user.InvalidOTP, 400);
  }

  if (isUserBanned(otpRecord.banExpiresAt)) {
    throw new AppError(message.user.Banned, 429);
  }

  if (isOTPExpired(otpRecord.expiresAt)) {
    throw new AppError(message.OTP.OTP_Expired, 400);
  }

  const isMatch = compareHash({ plainText: code, hash: otpRecord.otp });
  if (!isMatch) {
    otpRecord.failedAttempts += 1;

    if (otpRecord.failedAttempts >= 5) {
      otpRecord.banExpiresAt = Date.now() + 5 * 60 * 1000;
      await otpRecord.save();
      throw new AppError(message.user.Banned, 429);
    }

    await otpRecord.save();
    throw new AppError(message.user.InvalidOTP, 400);
  }

  otpRecord.failedAttempts = 0;
  otpRecord.banExpiresAt = null;
  await otpRecord.save();

  return otpRecord;
};