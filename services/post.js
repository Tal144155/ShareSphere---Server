const Post = require('../models/post');
const User = require("../models/user");
const friendService = require("../services/friend");

async function createPost(user_name, first_name, last_name, pic, profile, content, publish_date) {
    let post = new Post({
        user_name, first_name, last_name, pic, profile, content
    });
    if (publish_date)
        post.publish_date = publish_date;
    await addPost(user_name, post);
    return await post.save();
}

async function addPost(user_name, post) {
    const user = await User.findOne({ user_name });
    if (user) {
        user.posts.push(post._id);
        await user.save();
    }
}

// Delete a user's post
async function removePost(user_name, postId) {
    try {
        await User.updateOne(
            { user_name }, // Match the user by its username
            { $pull: { posts: postId } }) // Remove the specified post from the array
        return true;
    } catch (error) {
        return false;
    }
}

async function deletePost(user_name, postId) {
    const post = await Post.findById(postId);
    // Make sure the user ia authorised to delete this post
    if (post && post.user_name == user_name) {
        await Post.findOneAndDelete({ _id: postId });
        return removePost(user_name, postId);
    }
    return false;
}

// Edit a post's content and/or picture
async function editPost(user_name, postId, updatedContent, updatedPic) {
    try {
        const user = await User.findOne({ user_name }); // Find the user

        // Find the index of the post in the user's posts array
        const postIndex = user.posts.findIndex(post => post._id.toString() === postId.toString());

        // If the post is found
        if (postIndex !== -1) {
            const post = await Post.findById(user.posts[postIndex]);
            // Update the content and pic of the post
            if (updatedContent) post.content = updatedContent;
            if (updatedPic) post.pic = updatedPic;

            // Save the updated user
            await post.save();
            return post;
        } else
            // If the post is not found
            return null;
    } catch (error) {
        return null;
    }
}

// Return a post
async function getPostById(user, postId) {
    const postIndex = user.posts.findIndex(post => post._id.toString() === postId.toString())
    // If the post is found
    if (postIndex !== -1) {
        return await Post.findById(user.posts[postIndex]);
    }

    return null;
}

async function getUserPosts(req_user_name, user_name) {
    try {
        const user = await User.findOne({ user_name }).populate('posts'); // Find the user and populate the posts
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };

        const req_user = await User.findOne({ user_name: req_user_name });
        if (!req_user)
            return { code: 404, error: "This requested user doesn't exist!" };

        if (req_user_name == user_name || friendService.isFriend(user, req_user._id)) {
        // Sort the posts by publish_date in descending order
        const sortedPosts = user.posts.sort((a, b) => b.publish_date - a.publish_date);
        return sortedPosts;
        } else {
            return { code: 403, error: "You are not friends with this user!" };
        }

    } catch (error) {
        console.error("error:", error);
        return { code: 500, error: "Failed to fetch posts" };
    }
}


module.exports = {
    createPost, deletePost, editPost, getPostById, getUserPosts
}