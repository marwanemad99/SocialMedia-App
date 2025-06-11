
import { asyncHandler } from '../../../utils/response/index.js';
import { successResponse } from '../../../utils/response/success.response.js';
import * as dbService from '../../../database/db.service.js';
import { commentModel, postModel } from '../../../database/model/index.js';
import { AppError } from '../../../utils/appError.js';
import { message } from '../../../common/constants/messages.constants.js';
import { uploadImages } from '../../../utils/imageUpload.js';

export const createComment = asyncHandler(async (req, res, next) => {

  const { id, commentId } = req.params;

  if (commentId && !await dbService.findOne({ model: commentModel, filter: { _id: commentId, postId: id, isDeleted: { $exists: false } } })) {
    return next(new AppError(message.comment.NotFound, 404));
  };

  const post = await dbService.findOne({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: false } }
  })

  if (!post) return next(new AppError(message.post.NotFound, 404));

  if (req.files?.length) {
    req.body.attachments = await uploadImages({
      req,
      path: `user/${post.createdBy}/post/${id}/comment`
    });
  }

  const comment = await dbService.create({
    model: commentModel,
    data: {
      ...req.body,
      postId: id,
      createdBy: req.user._id,
      commentId
    }
  });
  return successResponse({ res, status: 201, data: comment, message: message.comment.created });
});

export const updateComment = asyncHandler(async (req, res, next) => {

  const { commentId } = req.params;

  const comment = await dbService.findOne({
    model: commentModel,
    filter: { _id: commentId, isDeleted: { $exists: false }, createdBy: req.user._id }
  });

  if (!comment) return next(new AppError(message.comment.NotFound, 404));

  if (req.files?.length) {
    req.body.attachments = await uploadImages({
      req,
      path: `user/${comment.createdBy}/comment/${commentId}`
    });
  }

  const updatedComment = await dbService.findOneAndUpdate({
    model: commentModel,
    filter: { _id: commentId },
    data: { ...req.body },
    options: { new: true }
  });
  return successResponse({ res, status: 200, data: updatedComment, message: message.comment.updated });
});


export const freezeComment = asyncHandler(async (req, res, next) => {
  const comment = await dbService.findOne({
    model: commentModel,
    filter: { _id: req.params.commentId, isDeleted: { $exists: false } },
    populate: [{ path: 'postId', select: 'createdBy' }]
  });

  if (!comment) return next(new AppError(message.comment.NotFound, 404));

  if (req.user.role !== 'ADMIN' &&
    comment.createdBy.toString() !== req.user._id.toString() &&
    comment.postId.createdBy.toString() !== req.user._id.toString()) {
    return next(new AppError(message.user.Forbidden, 403));
  }

  const updatedComment = await dbService.findOneAndUpdate({
    model: commentModel,
    filter: { _id: req.params.commentId },
    data: { isDeleted: true, deletedBy: req.user._id },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: updatedComment, message: message.comment.freeze });
});

export const restoreComment = asyncHandler(async (req, res, next) => {
  const comment = await dbService.findOne({
    model: commentModel,
    filter: { _id: req.params.commentId, isDeleted: true, deletedBy: req.user._id },
    populate: [{ path: 'postId', select: 'createdBy' }]
  });

  if (!comment) return next(new AppError(message.comment.NotFound, 404));

  if (req.user.role !== 'ADMIN' &&
    comment.createdBy.toString() !== req.user._id.toString() &&
    comment.postId.createdBy.toString() !== req.user._id.toString()) {
    return next(new AppError(message.user.Forbidden, 403));
  }

  const updatedComment = await dbService.findOneAndUpdate({
    model: commentModel,
    filter: { _id: req.params.commentId, isDeleted: true, deletedBy: req.user._id },
    data: { $unset: { deletedBy: 0, isDeleted: 0 }, updatedBy: req.user._id },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: updatedComment, message: message.comment.restore });
});