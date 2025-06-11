import { asyncHandler, successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { chatModel, userModel } from "../../../database/model/index.js";
import { AppError } from "../../../utils/appError.js";
import { message } from "../../../common/constants/messages.constants.js";

export const getChat = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const user = req.user;

  const friend = await dbService.findOne({
    model: userModel,
    filter: { _id: friendId },
    lean: false
  });
  if (!friend) {
    return new AppError(message.user.NotFound, 404);
  }
  const chat = await dbService.findOne({
    model: chatModel,
    filter: {
      users: { $all: [user._id, friendId] }
    },
    populate: [
      { path: 'users' },
    ]
  })
  return successResponse({ res, status: 200, data: chat });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const user = req.user;
  const { content } = req.body;

  let chat = await dbService.findOne({
    model: chatModel,
    filter: {
      users: { $all: [user._id, friendId] }
    },
    lean: false
  })

  if (!chat) {
    chat = await dbService.create({
      model: chatModel,
      data: {
        users: [user._id, friendId],
        messages: [{ sender: user._id, content }]
      }
    })
  } else {
    chat.messages.push({ sender: user._id, content });
    await chat.save();
  }

  const chatPopulated = await dbService.findOne({
    model: chatModel,
    filter: {
      _id: chat._id
    },
    populate: [{ path: 'users' }]
  })
  return successResponse({ res, status: 201, data: chatPopulated, message: message.message.created });
});