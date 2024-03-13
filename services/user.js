const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

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
    friend_requests: user[0].friend_requests
  };
  return userToSend;
};

const deleteUser = async (user_name) => {
  try {
    const userToDelete = await User.findOne({ user_name: user_name });
    if (userToDelete) {
      const user = await User.findOneAndDelete({ user_name: user_name });
      if (!user) {
        return false;
      }
      const deletedUserId = userToDelete._id;
      // Remove from friends
      await User.updateMany(
        { friends: deletedUserId },
        { $pull: { friends: deletedUserId } }
      );
      // Remove from friend_requests
      await User.updateMany(
        { friend_requests: deletedUserId },
        { $pull: { friend_requests: deletedUserId } }
      );

      // Delete user's posts
      await Post.deleteMany({ user_name: userToDelete.user_name });

      // Delete user's comments
      await Comment.deleteMany({ user_name: userToDelete.user_name });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const updateUser = async (user_name, first_name, last_name, pic) => {
  try {
    const updateFields = {
      first_name: first_name,
      last_name: last_name,
      pic: pic,
    };
    const updateFieldsComment = {
      first_name: first_name,
      last_name: last_name,
      profile: pic,
    };
    //updating user in: comments, posts, and user
    const updatedUser = await User.findOneAndUpdate(
      { user_name: user_name },
      { $set: updateFields },
      { new: true }
    );

    await Post.updateMany(
      { user_name: user_name },
      { $set: updateFieldsComment },
      { multi: true }
    );
    
    // Update user details in comments
    await Comment.updateMany(
      { user_name: user_name },
      { $set: updateFieldsComment },
      { multi: true }
    );

    if (updatedUser) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

async function isSigned(user_name, password) {
  try {
    let user = await User.findOne({ user_name, password });
    if (!user) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  createUser,
  isSigned,
  getUserName,
  getUserByUserName,
  deleteUser,
  updateUser,
};
