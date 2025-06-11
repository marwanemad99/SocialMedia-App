import { Router } from "express";
import * as commentService from './service/comment.service.js';
import { authMiddleware, authorizationMiddleware, validateMongoId, validation } from "../../middleware/index.js";
import { ROLE } from "../../common/constants/index.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import * as validators from './comment.validation.js';

const router = Router({
  mergeParams: true,
  strict: true,
  caseSensitive: true
});



router.post("/:commentId?",
  authMiddleware(),
  authorizationMiddleware(ROLE.USER),
  uploadCloudFile().array('attachment', 2),
  validation(validators.createComment),
  commentService.createComment
);

router.patch("/:commentId",
  authMiddleware(),
  authorizationMiddleware(ROLE.USER),
  validateMongoId('id', 'commentId'),
  uploadCloudFile().array('attachment', 2),
  validation(validators.updateComment),
  commentService.updateComment
);

router.delete("/:commentId/freeze",
  authMiddleware(),
  authorizationMiddleware([ROLE.ADMIN, ROLE.USER]),
  validateMongoId('id', 'commentId'),
  commentService.freezeComment
);

router.patch("/:commentId/restore",
  authMiddleware(),
  authorizationMiddleware([ROLE.ADMIN, ROLE.USER]),
  validateMongoId('id', 'commentId'),
  commentService.restoreComment
);

export default router;