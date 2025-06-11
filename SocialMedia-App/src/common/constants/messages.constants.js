
export const generateMessage = (entity) => ({
  AlreadyExists: `${entity} already exists!`,
  NotFound: `${entity} not found!`,
  FailedToCreate: `Failed to create ${entity}!`,
  FailedToUpdate: `Failed to update ${entity}!`,
  FailedToDelete: `Failed to delete ${entity}!`,
});

export const message = {
  user: {
    ...generateMessage('User'),
    CreatedSuccess: 'User created successfully!',
    Confirmed: 'User already confirmed!',
    InvalidOTP: 'Invalid OTP!',
    ConfirmedSuccess: 'User confirmed successfully!',
    Verify: 'Please verify your email!',
    Invalid_Credentials: 'Invalid credentials!',
    Unauthorize: 'Unauthorized!',
    OTP_Sent: 'OTP sent successfully!',
    OTP_Verified: 'OTP verified successfully!',
    Password_Updated: 'Password updated successfully!',
    Forbidden: 'Forbidden!',
    Banned: 'User is banned!',
    EmailUpdated: 'Email updated successfully!',
    WrongPassword: 'Wrong password!',
    Password_Updated: 'Password updated successfully!',
    FriendRequestSent: 'Friend request sent successfully!',
    FriendRequestAccepted: 'Friend request accepted successfully!',
  },
  INVALID_OBJECT_ID: 'Invalid object id!',
  OTP:{
    ...generateMessage('OTP'),
    OTP_Expired: 'OTP expired!',
  },
  post:{
    ...generateMessage('Post'),
    created: 'Post created successfully!',
    updated: 'Post updated successfully!',
    freezed: 'Post freezed successfully!',
    restored: 'Post restored successfully!',
    liked: 'Post liked successfully!',
    unlike: 'Post unlike successfully!',
  },
  comment:{
    ...generateMessage('Comment'),
    created: 'Comment created successfully!',
    updated: 'Comment updated successfully!',
    freezed: 'Comment freezed successfully!',
    restored: 'Comment restored successfully!',
  },
  role:{
    ...generateMessage('Role'),
    change: 'Role changed successfully!',
  },
  common:{
    tooManyRequest: 'Too many request!',
    validationError: 'Validation error!',
  },
  chat:{
    ...generateMessage('Chat'),
    created: 'Chat created successfully!',
    updated: 'Chat updated successfully!',
  },
  message:{
    ...generateMessage('Message'),
    created: 'Message created successfully!',
    updated: 'Message updated successfully!',
  }
};