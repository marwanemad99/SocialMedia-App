export const areFriends = (user, friend) => {  
  return user.friends?.map(String).includes(friend._id.toString()) ||
    friend.friends?.map(String).includes(user._id.toString());
};

export const isFriendRequestSent = (user, friend) => {
  return user.friendRequests?.map(String).includes(friend._id.toString()) ||
    friend.friendRequests?.map(String).includes(user._id.toString());
};