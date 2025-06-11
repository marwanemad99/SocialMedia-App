import { chatModel, userModel } from "../../database/model/index.js";
import * as dbService from "../../database/db.service.js";
import { message as messageObj } from "../../common/constants/index.js";
import { AppError } from "../../utils/appError.js";
export const sendMessage = (socket, io) => {

  return async ({ message, to }) => {
    const friendId = to;

    const user = socket.user;
    const content = message;

    const friend = await dbService.findOne({
      model: userModel,
      filter: { _id: friendId },
      lean: false
    });
    console.log({ friendId });

    if (!friend) {
      return;
    }
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

    io.to(friendId).emit('sendMessage', { message: content, sender: user._id });
    socket.emit('sendMessage', { message: content, sender: user._id });
  };
}