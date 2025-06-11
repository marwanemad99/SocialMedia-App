import { asyncHandler } from "../../../utils/response/index.js";
import { successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { postModel, userModel } from "../../../database/model/index.js";
import { CONFIRM_EMAIL_OTP, message, ROLE, UPDATE_EMAIL_OTP } from "../../../common/constants/index.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { compareHash, generateHash, validateOTP } from "../../../utils/security/index.js";
import { destroyImage, uploadImage } from "../../../utils/imageUpload.js";
import { AppError } from "../../../utils/appError.js";
import { areFriends, isFriendRequestSent } from "../helper/user.helper.js";


export const dashboard = asyncHandler(async (req, res, next) => {
  const [userResult, postResult] = await Promise.allSettled([
    dbService.find({
      model: userModel,
      select: "-password",
      populate: [{ path: "viewers.userId", select: "userName image email" }]
    }),
    dbService.find({
      model: postModel,
    })
  ]);

  const userData = userResult.status === "fulfilled" ? userResult.value : [];
  const postsData = postResult.status === "fulfilled" ? postResult.value : [];

  if (userResult.status === "rejected") {
    console.error("User fetch error:", userResult.reason);
  }
  if (postResult.status === "rejected") {
    console.error("Posts fetch error:", postResult.reason);
  }

  return successResponse({
    res,
    status: 200,
    data: {
      users: userData,
      posts: postsData
    }
  });
});

export const changeRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const roles = role === ROLE.SUPER_ADMIN ?
    { role: { $nin: [ROLE.SUPER_ADMIN] } } :
    { role: { $nin: [ROLE.SUPER_ADMIN, ROLE.ADMIN] } };
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.params.userId, ...roles },
    data: { role, updatedBy: req.user._id },
  });

  return user ? successResponse({ res, status: 200, data: user, message: message.role.change }) : next(new AppError(message.user.NotFound, 404));
});

export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbService.findOne({
    model: userModel, filter: { _id: req.user._id }, select: "-password", populate: [{
      path: "viewers.userId",
      select: "userName image email"
    },
    {path:'friends', select: 'userName image email'}]
  });
  return successResponse({ res, status: 200, data: user });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let user = null;
  if (req.user._id.toString() === id) {
    user = req.user;
  } else {
    user = await dbService.findOneAndUpdate(
      {
        model: userModel,
        filter: { _id: id, isDeleted: false },
        data: {
          $push: { viewers: { userId: req.user._id, time: new Date() } }
        },
        select: "userName image email",
      }
    );
  }

  return user ? successResponse({ res, status: 200, data: user }) : next(new AppError(message.user.NotFound, 404));
});

export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await dbService.findOne({
    model: userModel,
    filter: { email, isDeleted: false },
  })
  if (user) {
    return next(new AppError(message.user.AlreadyExists, 400));
  }
  console.log(req.user);

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { tempEmail: email },
  });

  emailEvent.emit("sendConfirmEmail", { email: req.user.email });
  emailEvent.emit("sendUpdateEmail", { email });
  return successResponse({ res, status: 200, message: message.user.OTP_Sent });
});


export const resetEmail = asyncHandler(async (req, res, next) => {
  const { oldCode, newCode } = req.body;

  await validateOTP({ email: req.user.email, code: oldCode, type: CONFIRM_EMAIL_OTP });
  await validateOTP({ email: req.user.tempEmail, code: newCode, type: UPDATE_EMAIL_OTP });

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { email: req.user.tempEmail, tempEmail: null, changeCredentialTime: Date.now() },
  });
  return successResponse({ res, status: 200, message: message.user.EmailUpdated });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!compareHash({ plainText: oldPassword, hash: req.user.password })) {
    return next(new AppError(message.user.WrongPassword, 400));
  }

  const hashPassword = generateHash({ plainText: newPassword });

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { password: hashPassword, changeCredentialTime: Date.now() },
  });

  return successResponse({ res, status: 200, message: message.user.Password_Updated });
});

export const updateProfile = asyncHandler(async (req, res, next) => {

  const user = await dbService.findOneAndUpdate({
    model: userModel,
    id: req.user._id,
    data: req.body,
    options: { new: true },
    select: "-password",
  });

  return user ? successResponse({ res, status: 200, data: user }) : next(new AppError(message.user.NotFound, 404));
});


export const updateProfileImage = asyncHandler(async (req, res, next) => {

  const { secure_url, public_id } = await uploadImage(req);

  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { image: { secure_url, public_id } },
    options: { new: false },
    select: '-password'
  });

  if (user.image?.public_id) {
    await destroyImage(user.image.public_id);
  }

  return successResponse({ res, status: 200, data: user });
});

export const updateCoverImage = asyncHandler(async (req, res, next) => {

  let coverImages = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadImage({ file, user: req.user });
    coverImages.push({ secure_url, public_id });
  }
  const user = await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { coverImages },
    options: { new: true },
    select: '-password'
  });

  return successResponse({ res, status: 200, data: { file: req.file } });
});

export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { friendId } = req.params;
  const user = req.user;
  const friend = await dbService.findOne({
    model: userModel,
    filter: { _id: friendId, isDeleted: false },
    lean: false
  });

  if (!friend) {
    return next(new AppError(message.user.NotFound, 404));
  }


  if (areFriends(user, friend) || isFriendRequestSent(friend, user)) {
    return next(new AppError(message.user.AlreadyExists, 400));
  }

  friend.friendRequests.push(user._id);
  await friend.save();

  return user ? successResponse({ res, status: 200, data: user, message: message.user.FriendRequest }) : next(new AppError(message.user.NotFound, 404));
});


export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const { friendId } = req.params;
  const user = req.user;
  const friend = await dbService.findOne({
    model: userModel,
    filter: { _id: friendId, isDeleted: false },
    lean: false
  });

  if (!friend) {
    return next(new AppError(message.user.NotFound, 404));
  }

  if (areFriends(user, friend)) {
    return next(new AppError(message.user.NotFound, 404));
  }

  user.friends.push(friend._id);
  friend.friends.push(user._id);

  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friend._id.toString());
  await Promise.all([user.save(), friend.save()]);

  return user ? successResponse({ res, status: 200, data: user, message: message.user.FriendRequestAccepted }) : next(new AppError(message.user.NotFound, 404));
});

