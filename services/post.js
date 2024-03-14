const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const friendService = require("../services/friend");


async function createPost(user_name, first_name, last_name, pic, profile, content, publish_date) {
    let post = new Post({
        user_name, first_name, last_name, pic, profile, content
    });
    if (publish_date)
        post.publish_date = publish_date;
    if (await addPost(user_name, post))
        return await post.save();
    return null;
}

async function addPost(user_name, post) {
    try {
        const user = await User.findOne({ user_name });
        if (user) {
            user.posts.push(post._id);
            await user.save();
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
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
        console.log(error);
        return false;
    }
}

async function deletePost(user_name, postId) {
    try {
        const post = await Post.findById(postId).populate('comments');;
        // Make sure the user ia authorised to delete this post
        if (post && post.user_name == user_name) {
            await Post.findOneAndDelete({ _id: postId });
            const commentIds = post.comments.map(comment => comment._id);
            await Comment.deleteMany({ _id: { $in: commentIds } });
            return removePost(user_name, postId);
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Edit a post's content and/or picture
async function editPost(user_name, postId, updatedContent, updatedPic) {
  try {
    const user = await User.findOne({ user_name }); // Find the user

    // Find the index of the post in the user's posts array
    const postIndex = user.posts.findIndex(
      (post) => post._id.toString() === postId.toString()
    );

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
        console.log(error);
        return null;

    }
}

// Return a post
async function getPostById(user, postId) {
  const postIndex = user.posts.findIndex(
    (post) => post._id.toString() === postId.toString()
  );
  // If the post is found
  if (postIndex !== -1) {
    return await Post.findById(user.posts[postIndex]);
  }

  return null;
}

async function getUserPosts(req_user_name, user_name) {
    try {
        const user = await User.findOne({ user_name }); // Find the user and populate the posts
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };

        await user.populate('posts');

        const req_user = await User.findOne({ user_name: req_user_name });
        if (!req_user)
            return { code: 404, error: "This requested user doesn't exist!" };

        let posts = [];

        if (req_user_name == user_name || friendService.isFriend(user, req_user._id)) {
            // Sort the posts by publish_date in descending order
            const sortedPosts = await Post.find({ user_name }).sort({ publish_date: -1 });
            for (const post of sortedPosts) {
                const newPost = {
                    _id: post._id,
                    user_name: post.user_name,
                    first_name: post.first_name,
                    last_name: post.last_name,
                    pic: post.pic,
                    profile: post.profile,
                    content: post.content,
                    likes: post.likes,
                    comments: post.comments.length,
                    publish_date: post.publish_date,
                  };
                  posts.push(newPost);
            }
            return posts;

        } else {
            return { code: 403, error: "You are not friends with this user!" };
        }

    } catch (error) {
        console.error("error:", error);
        return { code: 500, error: "Failed to fetch posts" };
    }
}


async function getFeed(user_name) {
    try {
        const user = await User.findOne({ user_name });
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };
        await user.populate('friends');

        let feed = []; // Initialize feed as an empty array
        let countFriends = 20;
        let countStrangers = 5;

        // Get all available posts and sort them by publish date
        const posts = await Post.find({}).sort({ publish_date: -1 }); // Sort posts by publish_date in descending order

        // Iterate through the posts
        for (const post of posts) {
            // Check if the post is from a friend or the user's himself
            if (countFriends > 0 && (user_name == post.user_name || friendService.populatedIsFriend(user, post.user_name))) {
                const newPost = {
                    _id: post._id,
                    user_name: post.user_name,
                    first_name: post.first_name,
                    last_name: post.last_name,
                    pic: post.pic,
                    profile: post.profile,
                    content: post.content,
                    likes: post.likes,
                    comments: post.comments.length,
                    publish_date: post.publish_date,
                  };
                feed.push(newPost);
                countFriends--;
            } else if (countStrangers > 0) { // Otherwise, check if it's from a stranger
                const newPost = {
                    _id: post._id,
                    user_name: post.user_name,
                    first_name: post.first_name,
                    last_name: post.last_name,
                    pic: post.pic,
                    profile: post.profile,
                    content: post.content,
                    likes: post.likes,
                    comments: post.comments.length,
                    publish_date: post.publish_date,
                  };
                feed.push(newPost);
                countStrangers--;
            }
            // If both counters are 0, break the loop
            if (countFriends === 0 && countStrangers === 0) break;
        }
        return feed;
    } catch (err) {
        console.log(err);
        return { code: 500, error: err };
    }
}


async function getPostByPostId(postid) {
  try {
    const post = await Post.findById(postid);
    if (!post) {
      return null;
    }
    return post;
  } catch (error) {
    return null;
  }
}

module.exports = {
  createPost,
  deletePost,
  editPost,
  getPostById,
  getUserPosts,
  getPostByPostId,
  getFeed
};
