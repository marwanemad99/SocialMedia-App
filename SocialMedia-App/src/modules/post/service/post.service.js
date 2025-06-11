import { uploadImages } from "../../../utils/imageUpload.js";
import { asyncHandler, listAllSuccessResponse, successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { postModel } from "../../../database/model/index.js";
import { message, ROLE } from "../../../common/constants/index.js";
import { AppError } from "../../../utils/appError.js";


export const getPosts = asyncHandler(async (req, res) => {
  const query = req.query;

  const posts = await dbService.find({
    model: postModel,
    filter: { isDeleted: { $exists: false } },
    populate: [
      { path: "createdBy", select: "userName email image.secure_url" },
      { path: 'likes', select: 'userName email image.secure_url' },
      {
        path: 'comments', match: { isDeleted: { $exists: false }, commentId: { $exists: false } },
        populate: [
          { path: 'reply', match: { isDeleted: { $exists: false } } }
        ]
      }
    ],
    query
  });

  return listAllSuccessResponse(
    {
      res, status: 200,
      data: posts.data,
      numberOfRecords: posts.numberOfRecords,
      numberOfPages: posts.numberOfPages,
      currentPage: posts.currentPage,
    }
  );
});


export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const attachments = await uploadImages({
    req,
    path: `/user/${req.user._id}/post`
  });

  const post = await dbService.create({
    model: postModel,
    data: {
      content,
      attachments,
      createdBy: req.user._id
    }
  });


  return post ? successResponse({ res, status: 201, data: post, message: message.post.created }) : next(new AppError(message.post.FailedToCreate, 400));
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let post = await dbService.findOne({
    model: postModel,
    filter: { _id: id, createdBy: req.user._id, isDeleted: { $exists: false } },
    lean: false
  });
  if (!post) return next(new AppError(message.post.NotFound, 404));

  if (req.files.length) {
    req.body.attachments = await uploadImages({
      req,
      path: `/user/${req.user._id}/post`
    });
  }


  post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, createdBy: req.user._id, isDeleted: { $exists: false } },
    data: { ...req.body, updatedBy: req.user._id },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: post, message: message.post.updated })
});


export const freezedPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const owner = req.user.role === ROLE.ADMIN ? {} : { createdBy: req.user._id };
  const post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: false }, ...owner },
    data: { isDeleted: true, updatedBy: req.user._id, deletedBy: req.user._id },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: post, message: message.post.freezed })
});

export const restorePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: true }, deletedBy: req.user._id },
    data: { updatedBy: req.user._id, $unset: { isDeleted: 0, deletedBy: 0 } },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: post, message: message.post.restored })
});


export const likePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: false } },
    data: { $addToSet: { likes: req.user._id } },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: post, message: message.post.liked })
});

export const unlikePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: false } },
    data: { $pull: { likes: req.user._id } },
    options: { new: true }
  })

  return successResponse({ res, status: 200, data: post, message: message.post.unlike })
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const owner = req.user.role === ROLE.ADMIN ? {} : { createdBy: req.user._id };
  const post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: false }, ...owner },
    data: { isDeleted: true, updatedBy: req.user._id, deletedBy: req.user._id },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: post, message: message.post.deleted })
});