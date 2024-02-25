const Post = require('../models/post');
const User = require("../models/user");

async function createPost(user_name, first_name, last_name, pic, profile, content, publish_date) {
    let post = new Post({
        user_name, first_name, last_name, pic, profile, content
    });
    if (publish_date)
        post.publish_date = publish_date;
    return await post.save();
}


// Delete a user's post
async function deletePost(user_name, postId) {
    try {
        await User.updateOne(
            { user_name }, // Match the user by its username
            { $pull: { posts: postId } }) // Remove the specified post from the array
        return true;
    } catch (error) {
        return false;
    }
}

// Edit a post's content and/or picture
async function editPost(user_name, postId, updatedContent, updatedPic) {
    try {
        const user = await User.findOne({ user_name }); // Find the user

        // Find the index of the post in the user's posts array
        const postIndex = user.posts.findIndex(post => post._id.toString() === postId.toString());
        
        // If the post is found
        if (postIndex !== -1) {
            // Update the content and pic of the post
            if (updatedContent) user.posts[postIndex].content = updatedContent;
            if (updatedPic) user.posts[postIndex].pic = updatedPic;

             // Save the updated user
             await user.save();
             return user.posts[postIndex];
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
        return user.posts[postIndex];
    }

    return null;
}



module.exports = {
    createPost, deletePost, editPost, getPostById
}