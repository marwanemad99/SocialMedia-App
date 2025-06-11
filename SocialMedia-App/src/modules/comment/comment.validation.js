import Joi from "joi";



export const createComment = Joi.object({
  id: Joi.string().required(),
  content: Joi.string().trim().min(2).max(1000),
  commentId: Joi.string(),
  file: Joi.array().items(
    Joi.object().keys({
      fieldname: Joi.string().valid('attachment').required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().required(),
      finalPath: Joi.string(),
    })),
}).or('content', 'file');


export const updateComment = Joi.object({
  id: Joi.string().required(),
  commentId: Joi.string().required(),
  content: Joi.string().trim().min(2).max(1000),
  file: Joi.array().items(
    Joi.object().keys({
      fieldname: Joi.string().valid('attachment').required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().required(),
      finalPath: Joi.string(),
    })),
}).or('content', 'file');