const User = require("../models/user");

const createUser = async (user_name, password, first_name, last_name, pic) => {
  const user = new User({
    user_name: user_name,
    password: password,
    first_name: first_name,
    last_name: last_name,
    pic: pic,
  });
  return await user.save();
};


