import { Router } from "express";
import { authMiddleware, validateMongoId } from "../../middleware/index.js";
import * as chatService from "./service/chat.service.js";
const router = Router();


router.get('/:friendId',
  authMiddleware(),
  validateMongoId('friendId'),
  chatService.getChat
)


//NOTE - For Testing purpose only
router.post('/message/:friendId',
  authMiddleware(),
  validateMongoId('friendId'),
  chatService.sendMessage
)
export default router;