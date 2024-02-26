const commentService = require("../services/comment");
const userService = require("../services/user");

const createComment = async (req, res) => {
  const user = await userService.getUserByUserName(req.params.id);
  const commentSaved = commentService.createComment(
    req.params.pid,
    req.params.id,
    user.first_name,
    user.last_name,
    user.pic,
    req.body.content
  );
  if (commentSaved) {
    return res.status(201).json({ message: "comment added succesfully" });
  } else {
    return res.status(404).json({ error: "comment was not found" });
  }
};

const getComments = async (req, res) => {
  const postId = req.params.pid;
  const commentsArray = await commentService.getComments(postId);
  if (commentsArray == null) {
    return res.status(404).json({ error: "post was not found" });
  }
  res.json(commentsArray);
};

const editComment = async (req, res) => {
  const user_name = req.params.id;
  const comment_id = req.params.cid;
  const comment = await commentService.getComment(comment_id);
  if (comment) {
    if (comment.user_name === user_name) {
      const updated = await commentService.editComment(
        req.headers.content,
        comment_id
      );
      if (updated) {
        return res.status(200).json({ message: "Comment has been updated" });
      } else {
        return res.status(500).json({ error: "Failed to update comment" });
      }
    } else {
      return res.status(403).json({ error: "User doesn't own this comment" });
    }
  } else {
    return res.status(404).json({ error: "Comment not found" });
  }
};

const deleteComment = async (req, res) => {
  const user_name = req.params.id;
  const comment_id = req.params.cid;
  const comment = await commentService.getComment(comment_id);
  if (comment) {
    if (comment.user_name === user_name) {
      const deleted_comment = await commentService.deleteComment(
        req.params.pid,
        comment_id
      );
      if (deleted_comment) {
        return res.status(200).json({ message: "Comment has been deleted" });
      } else {
        return res.status(500).json({ error: "Failed to delete comment" });
      }
    } else {
      return res.status(403).json({ error: "User doesn't own this comment" });
    }
  } else {
    return res.status(404).json({ error: "Comment not found" });
  }
};

module.exports = { createComment, getComments, editComment, deleteComment };
