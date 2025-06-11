import Joi from "joi";
import { GENDER } from "../../common/constants/index.js";

export const updateEmail = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net'] } }).trim().required(),
}).required();

export const resetEmail = Joi.object().keys({
  oldCode: Joi.string().min(4).max(4).required(),
  newCode: Joi.string().min(4).max(4).required(),
}).required();

export const updatePassword = Joi.object().keys({
  oldPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])/)).min(6).max(50).required(),
  newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])/)).min(6).max(50).required(),
}).required();

export const updateProfile = Joi.object().keys({
  userName: Joi.string().min(3).max(50).trim(),
  DOB: Joi.date().less('now'),
  gender: Joi.string().valid(GENDER).trim(),
  address: Joi.string().min(3).max(100).trim(),
  phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).trim(),
})

export const updateProfileImage = Joi.object().keys({
  file: Joi.object().keys({
    fieldname: Joi.string().valid('attachment').required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
    finalPath: Joi.string(),
  }).required(),
}).required();
