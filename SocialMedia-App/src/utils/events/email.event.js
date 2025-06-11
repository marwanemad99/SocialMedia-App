import { EventEmitter } from "node:events";
import { createOTP, generateHash } from "../security/index.js";
import { userModel } from "../../database/model/index.js";
import { sendEmail, verifyAccountTemplate } from "../email/index.js";
import * as dbService from "../../database/db.service.js";
import { CONFIRM_EMAIL_OTP, FORGET_PASSWORD_OTP, TWO_STEP_VERIFICATION_OTP, UPDATE_EMAIL_OTP } from "../../common/constants/index.js";
export const emailEvent = new EventEmitter();
const emailSubject = {
  confirm: "Confirm-Email",
  forget: "Forget-Password",
  update: "Update-Email",
  two_step_verification: "Two-Step-Verification"
};

emailEvent.on("sendConfirmEmail", async (data) => {
  await sendCode(data, emailSubject.confirm, CONFIRM_EMAIL_OTP);
});

emailEvent.on("sendForgetPassword", async (data) => {
  await sendCode(data, emailSubject.forget, FORGET_PASSWORD_OTP);
});

emailEvent.on("sendUpdateEmail", async (data) => {
  await sendCode(data, emailSubject.update, UPDATE_EMAIL_OTP);
});

emailEvent.on("sendTwoStepVerification", async (data) => {
  await sendCode(data, emailSubject.two_step_verification, TWO_STEP_VERIFICATION_OTP);
});

export const sendCode = async (data = {}, subject = emailSubject.confirm, type = 'confirmEmailOTP') => {
  const { email } = data;
  const { otp } = await createOTP({ email, type });

  const html = verifyAccountTemplate({ code: otp });
  await sendEmail({
    to: email,
    subject: subject,
    text: `Your OTP is ${otp}`,
    html,
  });
};