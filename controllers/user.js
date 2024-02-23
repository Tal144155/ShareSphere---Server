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
    return res.status(201).json({ message: ["user added succesfully"] });
  } else {
    return res.status(409).json({ error: ["user name already exists"] });
  }
};

//need to send without the password!!
//jwt needs to be attached and checked
//request has the jwt, needs to be extracted and checked that match.
const getUser = async (req, res) => {
  const user = await userService.getUserByUserName(req.params.id);
  if (user == null) {
    return res.status(404).json({ error: ["user not found"] });
  }
  res.json(user);
};

module.exports = { createUser, getUser };
