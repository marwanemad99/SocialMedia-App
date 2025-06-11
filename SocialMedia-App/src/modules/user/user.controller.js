import { Router } from "express";
import { authMiddleware, authorizationMiddleware, validateMongoId, validation } from "../../middleware/index.js";
import * as userService from './service/user.service.js';
import * as validators from './user.validation.js';
import { uploadCloudFile, uploadFileDisk } from "../../utils/multer/index.js";
import { ROLE } from "../../common/constants/role.constant.js";
const router = Router();

router.get("/profile/dashboard", authMiddleware(), authorizationMiddleware([ROLE.SUPER_ADMIN, ROLE.ADMIN]), userService.dashboard);
router.get("/profile", authMiddleware(), userService.profile);
router.patch("/:userId/profile/dashboard/role", validateMongoId('userId'), authorizationMiddleware([ROLE.SUPER_ADMIN, ROLE.ADMIN]), authMiddleware(), userService.changeRole);
router.get("/profile/:id", validateMongoId("id"), authMiddleware(), userService.shareProfile);
router.patch('/update-email', validation(validators.updateEmail), authMiddleware(), userService.updateEmail);
router.patch('/reset-email', validation(validators.resetEmail), authMiddleware(), userService.resetEmail);
router.patch('/update-password', validation(validators.updatePassword), authMiddleware(), userService.updatePassword);
router.patch('/profile', validation(validators.updateProfile), authMiddleware(), userService.updateProfile);
router.patch('/profile/image',
  authMiddleware(),
  uploadCloudFile().single("attachment"),
  validation(validators.updateProfileImage),
  userService.updateProfileImage);
router.patch('/profile/cover',
  authMiddleware(),
  uploadCloudFile().array("attachment", 3),
  userService.updateCoverImage);

router.post('/friend-request/:friendId',
  validateMongoId('friendId'),
  authMiddleware(),
  userService.sendFriendRequest);

router.post('/friend-request/:friendId/accept',
  validateMongoId('friendId'),
  authMiddleware(),
  userService.acceptFriendRequest);

export default router; 