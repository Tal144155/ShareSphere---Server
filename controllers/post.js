const { estimatedDocumentCount } = require('../models/user');
const postService = require('../services/post');

async function createPost(req, res) {
    const newPost = await postService.createPost(
        req.body.user_name,
        req.body.first_name,
        req.body.last_name,
        req.body.pic,
        req.body.profile,
        req.body.content,
        req.body.publish_date
    );
    if (newPost) {
        return res.status(201).json(newPost);
    } else {
        return res.status(500).json({ error: "Failed to create post" });
    }
}

async function getPostById(req, res) {
    const postId = req.headers.postId;
    const post = await postService.getPostById(postId);
    if (post) {
        return res.status(200).json({ post }, { message: "Post added successfully" });
    } else {
        return res.status(404).json({ error: "Post not found" });
    }
}

async function editPost(req, res) {
    const content = req.headers.content;
    const pic = req.headers.pic;
    const updatedPost = await postService.editPost(req.params.id, req.params.pid, content, pic);
    if (updatedPost) {
        return res.status(201).json({ post }, { message: "Post updated successfully" });
    } else {
        return res.status(500).json({ error: "Failed to update post" });
    }
}

async function deletePost(req, res) {
    const hasWorked = await postService.deletePost(req.params.id, req.params.pid);
    if (hasWorked) {
        return res.status(201).json({ message: "Post deleted successfully" });
    } else {
        return res.status(500).json({ error: "Failed to delete post" });
    }
}

module.exports = {
    createPost, getPostById, editPost, deletePost
}