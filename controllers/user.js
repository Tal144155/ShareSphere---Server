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

module.exports = { createUser };
