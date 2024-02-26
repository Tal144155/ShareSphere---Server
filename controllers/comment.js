const commentService = require("../services/comment");

const createComment = async (req, res) => {
  const commentSaved = commentService.createComment(
    req.params.pid,
    req.params.id,
    req.body.first_name,
    req.body.last_name,
    req.body.pic,
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
  const commentsArray = commentService.getComments(postId);
  if (commentsArray == null) {
    return res.status(404).json({ error: "comment was not found" });
  }
  res.json(commentsArray);
};

const editComment = async (req, res) => {
  const user_name = req.params.id;
  const comment_id = req.params.cid;
  const comment = commentService.getComment(comment_id);
  if (comment) {
    if (comment.user_name === user_name) {
      commentService.editComment(req.body.content, comment_id);
      return res.status(200).json({ message: "Comment has been updated" });
    } else {
      return res.status(403).json({ error: "user dont own this comment" });
    }
  }
};

module.exports = { createComment, getComments, editComment };
