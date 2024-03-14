const User = require("../models/user");

// Removes the user_fid from the given user's friend requests
async function removeRequest(user_name, user_fid) {
  try {
    await User.updateOne(
      { user_name }, // Match the user by its username
      { $pull: { friend_requests: user_fid } }) // Remove the specified friend request from the array
    return true;
  } catch (error) {
    return false;
  }
}

// Adds the user_fid to the given user's friends
async function addFriend(user, user_fid) {
  try {
    user.friends.push(user_fid);
    await user.save();
    return true;
  } catch (error) {
    return false;
  }
}

// Removes the user_fid from the given user's friends
async function deleteFriend(user_name, user_fid) {
  try {
    await User.updateOne(
      { user_name }, // Match the user by its username
      { $pull: { friends: user_fid } }) // Remove the specified friend from the array
    return true;
  } catch (error) {
    return false;
  }
}

async function getFriends(user) {
  if (user.populated('friends') == undefined)
    // Populate the 'friends' field of the user document
    await user.populate('friends');
  // Return the friends array
  return user.friends
}

async function getFriendRequests(user) {
  if (user.populated('friend_requests') == undefined)
    // Populate the 'friend_requests' field of the user document
    await user.populate('friend_requests');
  // Return the friend requests array
  return user.friend_requests
}

// Search for the friend id in the friends array of the user
function isFriend(user, friend_id) {
  const friendIndex = user.friends.findIndex(ObjectId => ObjectId.toString() === friend_id.toString());
  return friendIndex !== -1
}

async function areFriends(user_name_1, user_name_2) {
  try {
    const user = await User.findOne({ user_name: user_name_1 });
    if (!user)
      return false;
    await user.populate('friends');
    return populatedIsFriend(user, user_name_2);
  } catch (error) {
    return false;
  }
}

// Search for the friend user name in the friends array of the user
function populatedIsFriend(user, friend_user_name) {
  const friendIndex = user.friends.findIndex(user => user.user_name === friend_user_name);
  return friendIndex !== -1
}

// Search for the friend id in the friend requests array of the user and return it
function isRequested(user, friend_id) {
  const friendIndex = user.friend_requests.findIndex(ObjectId => ObjectId.toString() === friend_id.toString());
  return friendIndex !== -1
}

module.exports = {
  removeRequest, addFriend, getFriends, isFriend, isRequested, deleteFriend, getFriendRequests, populatedIsFriend, areFriends
}