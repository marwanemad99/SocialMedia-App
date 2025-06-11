import connectDb from "../src/database/connection.js";
import { globalErrorHandling, morganMiddleware } from "./middleware/index.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import postController from "./modules/post/post.controller.js";
import chatController from "./modules/chat/chat.controller.js";
import cors from 'cors';
import path from 'node:path';
import rateLimit from "express-rate-limit";
import { AppError } from "./utils/appError.js";
import { message } from "./common/constants/messages.constants.js";
import helmet from "helmet";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/modules.schema.js";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    return next(new AppError(message.common.tooManyRequest, 429));
  },
  skip: (req) => req.ip === '127.0.0.1',
  legacyHeaders: true,
  standardHeaders: 'draft-8',
});

const bootstrap = (app, express) => {


  app.use(morganMiddleware);
  app.use(cors());
  app.use(helmet());
  app.use('/post', limiter);
  app.use('/uploads', express.static(path.resolve('./src/uploads')));
  app.use(express.json());
  app.use('/graphql', createHandler({ schema }));
  app.get('/', (req, res) => res.send('Hello World!'));

  app.use('/auth', authController);
  app.use('/user', userController);
  app.use('/post', postController);
  app.use('/chat', chatController);
  app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(globalErrorHandling);

  connectDb();
}

export default bootstrap;
