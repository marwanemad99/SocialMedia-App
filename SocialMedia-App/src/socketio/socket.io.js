import { Server } from "socket.io";
import { authSocketMiddleware } from "./middleware/auth.socket.js";
import { sendMessage } from "./chat/chat.service.js";

export const runSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    }
  });

  io.use(authSocketMiddleware)
  io.on('connection', (socket) => {
    console.log('a user connected', { socket: socket.id });

    socket.on('sendMessage', sendMessage(socket, io));
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}