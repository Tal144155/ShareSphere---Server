const Post = require("../models/post");
const postService = require("./post");
const userService = require("./user");

const isLiked = async (user_name, pid) => {
  try {
    const post = await postService.getPostByPostId(pid);
    const user = await userService.getUserName(user_name);
    const user_id = user[0]._id;
    const likedByUser = post.liked_by.some((userId) => userId.equals(user_id));
    return likedByUser;
  } catch (error) {
    return false;
  }
};

const like = async (user_name, pid) => {
  try {
    const didlike = await isLiked(user_name, pid);

    if (didlike) {
      const user = await userService.getUserName(user_name);
      const user_id = user[0]._id;
      const post = await postService.getPostByPostId(pid);
      await Post.updateMany({ _id: pid }, { $pull: { liked_by: user_id } });
      post.likes--;
      await post.save();
      return true;
    } else {
      const user = await userService.getUserName(user_name);
      const user_id = user[0].id;
      const post = await postService.getPostByPostId(pid);
      post.liked_by.push(user_id);
      post.likes++;
      await post.save();
      return true;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  isLiked,
  like,
};
