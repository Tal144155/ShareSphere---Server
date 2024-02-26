const Comment = require("../models/comment");
const Post = require("../models/post");
const postService = require("./post.js");

const createComment = async (
  postid,
  user_name,
  first_name,
  last_name,
  pic,
  content
) => {
  //creating a new comment
  const comment = new Comment({
    user_name: user_name,
    first_name: first_name,
    last_name: last_name,
    pic: pic,
    content: content,
  });
  //saving comment in the db
  const commentSaved = await comment.save();
  const commentId = commentSaved._id;
  //adding comment to the comments list in post
  const post = await postService.getPostById(user_name, postid);
  if (!post) {
    // Handle the case where the post with the given postid is not found
    return false;
  }
  post.comments.push(commentId);
  post.comment_number++;
  //saving info
  await post.save();
  return true;
};

const getComment = async (cid) => {
  const comment = await Comment.findById(cid);
  if (comment) {
    return comment;
  }
  return null;
};

//getting all comments of a ceirtian post
const getComments = async (pid, user_name) => {
  const post = await postService.getPostById(user_name, pid);
  if (!post) {
    return null;
  }
  return post.populate("comments");
};

//editing comments content
const editComment = async (content, cid) => {
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: cid },
    { $set: { content: content } },
    { new: true }
  );
  if (updatedComment) {
    return true;
  }
  return false;
};

//deleting comment from post
const deleteComment = async (pid, cid) => {
  const deletedComment = await Comment.findOneAndDelete({ _id: cid });
  if (!deletedComment) {
    return false;
  }
  const post = await Post.findByIdAndUpdate(pid, {
    $pull: { comments: cid },
  });
  if (!post) {
    return false;
  }
  return true;
};

module.exports = {
  createComment,
  getComments,
  editComment,
  getComment,
  deleteComment,
};
