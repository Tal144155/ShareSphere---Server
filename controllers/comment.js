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
    return res.status(404).json({ error: "post was not found" });
  }
};

const getComments = async (req, res) => {
    const postId = req.params.pid;
    const commentsArray = commentService.getComments(postId);
    if(commentsArray==null) {
        return res.status(404).json({ error: "post was not found" });
    }
    res.json(commentsArray);
}

module.exports = { createComment };

