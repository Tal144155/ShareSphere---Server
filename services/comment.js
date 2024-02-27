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
    profile: pic,
    content: content,
  });
  //saving comment in the db
  const commentSaved = await comment.save();
  const commentId = commentSaved._id;
  //adding comment to the comments list in post
  const post = await postService.getPostByPostId(postid);
  if (!post) {
    // Handle the case where the post with the given postid is not found
    return false;
  }
  post.comments.push(commentId);
  //saving info
  await post.save();
  return true;
};

const getComment = async (cid) => {
  try {
    const comment = await Comment.findById(cid);
    if (comment) {
      return comment;
    }
    return null;
  } catch (error) {
    return null;
  }
};

//getting all comments of a ceirtian post
const getComments = async (pid) => {
  const post = await postService.getPostByPostId(pid);
  if (!post) {
    return null;
  }
  const comments = await post.populate("comments");
  return comments.comments;
};

//editing comments content
const editComment = async (content, cid) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: cid },
      { $set: { content: content } },
      { new: true }
    );

    if (updatedComment) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

//deleting comment from post
const deleteComment = async (pid, cid) => {
  try {
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
  } catch (error) {
    return false;
  }
};

module.exports = {
  createComment,
  getComments,
  editComment,
  getComment,
  deleteComment,
};
