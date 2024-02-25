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
  const post = await postService.getPostById(postid);
  post.comments.push(commentId);
  //saving info
  await post.save();
  return true;
};
