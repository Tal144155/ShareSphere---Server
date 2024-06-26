const mongoose = require("mongoose");
const User = require('./user');
const friendService = require('../services/friend')


async function getFriends(req_user_name, user_name) {
    try {
        const user = await User.findOne({ user_name })
        // Check if the user exists
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };

        // Check if the requesting user is trying to access their own friend list
        if (req_user_name !== user_name) {

            const req_user = await User.findOne({ user_name: req_user_name })
            // Check if the user exists
            if (!req_user)
                return { code: 404, error: "This requested user doesn't exist!" };


            // If they are not friends
            if (friendService.isFriend(user, req_user._id) == false)
                return { code: 403, error: "Access denied! You are not friends with this user!" };
        }

        return friendService.getFriends(user)

    } catch (error) {
        // Handle any errors
        console.error("Error:", error.message);
        return { code: 500, error: "An error occurred while fetching friends." };
    }
}


async function getFriendRequests(user_name) {
    try {
        const user = await User.findOne({ user_name })
        // Check if the user exists
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };
        return friendService.getFriendRequests(user);
    } catch (error) {
        // Handle any errors
        console.error("Error:", error.message);
        return { code: 500, error: "An error occurred while fetching friend requests." };
    }
}


async function friendRequest(req_user_name, res_user_name) {
    // Users can't befriend themselves
    if (req_user_name == res_user_name)
        return { code: 403, error: "You can't befriend yourself!" }

    try {
        const req_user = await User.findOne({ user_name: req_user_name })
        // Check if the user exists
        if (!req_user)
            return { code: 404, error: "This user doesn't exist!" };

        // Retrieve the user to whom the friend request is being sent
        const res_user = await User.findOne({ user_name: res_user_name })
        if (!res_user)
            return { code: 404, error: "This requested user doesn't exist!" };

        // Check if the users are already friends
        if (friendService.isFriend(req_user, res_user._id))
            return { code: 403, error: "Invalid request! You are already friends with this user!" };

        // Check if the request is new
        if (friendService.isRequested(res_user, req_user._id))
            return { code: 403, error: "You've already sent a friend request to this user!" };

        // Add the requesting user to the other user's list of friend requests
        res_user.friend_requests.push(req_user._id)
        await res_user.save()

        // Return a success message or code
        return { code: 200, message: "Friend request sent successfully." };
    } catch (error) {
        // Handle any errors
        console.error("Error:", error.message);
        return { code: 500, error: "An error occurred while friend requesting." };
    }
}


async function approveFriendRequest(user_name, friend_user_name) {
    try {
        const user = await User.findOne({ user_name })
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };
        const friend = await User.findOne({ user_name: friend_user_name })
        if (!friend)
            return { code: 404, error: "This requested user doesn't exist!" };
        if (!friendService.isRequested(user, friend._id))
            return { code: 403, error: "This user isn't requesting to befriend you!" };

        // Remove the fid from the friend requests array and add it to the friends array
        let hasWorked = await friendService.removeRequest(user_name, friend._id)
        hasWorked = hasWorked && await friendService.addFriend(user, friend._id)
        // Add the user to the fid's friends array
        hasWorked = hasWorked && await friendService.addFriend(friend, user._id)
        if (hasWorked)
            return { code: 201, message: "You are now friends!" }
        return { code: 500, error: "Failed to add friend" }
    } catch (error) {
        // Handle any errors
        console.error("Error:", error.message);
        return { code: 500, error: "An error occurred while adding friend." };
    }
}


async function deleteFriend(user_name, friend_user_name) {
    try {
        const user = await User.findOne({ user_name })
        if (!user)
            return { code: 404, error: "This user doesn't exist!" };
        const friend = await User.findOne({ user_name: friend_user_name })
        if (!friend)
            return { code: 404, error: "This requested user doesn't exist!" };

        // Check if we need to delete a friend request or a friend
        if (friendService.isRequested(user, friend._id)) {
            friendService.removeRequest(user_name, friend._id)
            return { code: 201, message: "Successfully removed friend request" }
        } else {
            // Delete the users from each others arrays of friends
            let hasWorked = await friendService.deleteFriend(user_name, friend._id)
            hasWorked = hasWorked && friendService.deleteFriend(friend_user_name, user._id)
            if (hasWorked)
                return { code: 201, message: "You are no longer friends" }
            return { code: 500, error: "Failed to delete friend" }
        }
    } catch (error) {
        // Handle any errors
        console.error("Error:", error.message);
        return { code: 500, error: "An error occurred while deleting a friend." };
    }
}



module.exports = { getFriends, friendRequest, approveFriendRequest, deleteFriend, getFriendRequests }