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
    res.json(newUser);
  } else {
    return res.status(409).json({ error: ["user name already exists"] });
  }
};

//need to send without the password!!
//jwt needs to be attached and checked
const getUser = async (req, res) => {
  const user = await userService.getUserName(req.params.id);
  if (!user) {
    res.status(404);
  }
};

module.exports = { createUser };
