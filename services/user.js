const User = require("../models/user");

const createUser = async (user_name, password, first_name, last_name, pic) => {
  const existingUser = await getUserName(user_name);
  if (existingUser.length > 0) {
    console.log("User with this username already exists.");
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

async function isSigned(user_name, password) {
  let user = await User.findOne({ user_name, password });
  // Check if user exists
  if (!user) return false;
  return true;
}

module.exports = { createUser, isSigned, getUserName, getUserByUserName };
