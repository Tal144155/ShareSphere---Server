const likeService = require("../services/like");

const isLiked = async (req, res) => {
  const user_name = req.params.id;
  const pid = req.params.pid;
  const didlike = await likeService.isLiked(user_name, pid);
  if (didlike) {
    return res.status(200).json({ isLiked: true });
  } else {
    return res.status(404).json({ isLiked: false });
  }
};

const like = async (req, res) => {
  const user_name = req.params.id;
  const pid = req.params.pid;
  const setLike = likeService.like(user_name, pid);
  if (setLike) {
    return res.status(200).json({ message: "like has been set" });
  } else {
    return res.status(404).json({ error: "post/user not found" });
  }
};

module.exports = { isLiked, like };
