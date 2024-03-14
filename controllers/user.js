const userService = require("../services/user");

const createUser = async (req, res) => {
  const newUser = await userService.createUser(
    req.body.user_name,
    req.body.password,
    req.body.first_name,
    req.body.last_name,
    req.body.pic
  );
  if (newUser != null) {
    return res.status(201).json({ message: "User added succesfully" });
  } else {
    return res.status(409).json({ error: "User name already exists" });
  }
};

const doesExistUserName = async (req, res) => {
  const user = await userService.getUserByUserName(req.headers.id);
  if (user == null) {
    return res.status(200).json({ message: "user can be added" });
  }
  return res.status(409).json({ error: "User name already exists" });
};

// Request has the jwt, needs to be extracted and checked that match.
const getUser = async (req, res) => {
  const user = await userService.getUserByUserName(req.params.id);
  if (user == null) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (user) {
    return res.status(200).json({ message: "User has been deleted" });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};

const updateUser = async (req, res) => {
  const user_name = req.params.id;
  const first_name = req.body.firstname;
  const last_name = req.body.lastname;
  const pic = req.body.pic;
  const updatedUser = await userService.updateUser(
    user_name,
    first_name,
    last_name,
    pic
  );
  if (updatedUser) {
    return res.status(200).json({ message: "User has been updated" });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
};

module.exports = { createUser, getUser, deleteUser, updateUser, doesExistUserName };
