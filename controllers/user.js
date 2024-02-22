const userService = require("../services/user");

const createUser = async (req, res) => {
  res.json(
    await userService.createUser(
      req.body.user_name,
      req.body.password,
      req.body.first_name,
      req.body.last_name,
      req.body.pic
    )
  );
};



module.exports = {createUser};
