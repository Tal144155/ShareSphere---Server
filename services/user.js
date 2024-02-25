const { ObjectId } = require("mongoose/lib/schema");
const User = require("../models/user");

const createUser = async (user_name, password, first_name, last_name, pic) => {
  const existingUser = await getUserName(user_name);
  if (existingUser.length > 0) {
    return null;
  }
  const user = new User({
    user_name: user_name,
    password: password,
    first_name: first_name,
    last_name: last_name,
    pic: pic,
  });
  return await user.save();
};

//should be in models?
const getUserName = async (user_name) => {
  return await User.find({ user_name: user_name });
};

const getUserByUserName = async (user_name) => {
  const user = await getUserName(user_name);
  if (user.length == 0) {
    return null;
  }
  const userToSend = {
    user_name: user[0].user_name,
    first_name: user[0].first_name,
    last_name: user[0].last_name,
    pic: user[0].pic,
  };
  return userToSend;
};

const deleteUser = async (user_name) => {
  const user = await User.findOneAndDelete({ user_name: user_name });
  if (!user) {
    return false;
  }
  return true;
};

const updateUser = async (user_name, first_name, last_name, pic) => {
  const updateFields = {
    first_name: first_name,
    last_name: last_name,
    pic: pic,
  };
  const updatedUser = await User.findOneAndUpdate(
    { user_name: user_name },
    { $set: updateFields },
    { new: true }
  );

  if (updatedUser) {
    return true;
  } else {
    return false;
  }
};

async function isSigned(user_name, password) {
  let user = await User.findOne({ user_name, password });
  // Check if user exists
  if (!user) return false;
  return true;
}


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

// Search for the friend id in the friend requests array of the user and return it
function isRequested(user, friend_id) {
    const friendIndex = user.friend_requests.findIndex(ObjectId => ObjectId.toString() === friend_id.toString());
    return friendIndex !== -1
}


module.exports = { createUser, isSigned, removeRequest, addFriend, getFriends, isFriend, isRequested, deleteFriend, getFriendRequests, getUserName,
  getUserByUserName,
  deleteUser,
  updateUser };
