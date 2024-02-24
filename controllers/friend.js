const friendModel = require('../models/friend')

const getFriends = async (req, res) => {
    try {
        const req_user_name = req.headers.username;
        const id = req.params.id;
        const friends = await friendModel.getFriends(req_user_name, id);
        
        // Check if there is an error
        if (friends.error) {
            // Send an error response with the error code and message
            res.status(friends.code).json({ error: friends.error });
        } else {
            // Send a success response with the friends array and status code 200
            res.status(200).json(friends);
        }
    } catch (error) {
        // Handle any unexpected errors and send a 500 response
        console.error("Error:", error.message);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
};

const friendRequest = async (req, res) => {
    const req_user_name = req.headers.username;
    const res_user_name = req.params.id
    const result = await friendModel.friendRequest(req_user_name, res_user_name)
    // Check if there is an error
    if (result.error) {
        // Send an error response with the error code and message
        res.status(result.code).json({ error: result.error });
    } else {
        // Send a success response with status code and message
        res.status(result.code).json({ message: result.message });
    }
}

const approveFriendRequest = async (req, res) => {
    const user = req.params.id
    const friend = req.params.fid
    const result = await friendModel.approveFriendRequest(user, friend)
    // Check if there is an error
    if (result.error) {
        // Send an error response with the error code and message
        res.status(result.code).json({ error: result.error });
    } else {
        // Send a success response with status code and message
        res.status(result.code).json({ message: result.message });
    }
}

const deleteFriend = async (req, res) => {
    const user = req.params.id
    const friend = req.params.fid
    const result = await friendModel.deleteFriend(user, friend)
    // Check if there is an error
    if (result.error) {
        // Send an error response with the error code and message
        res.status(result.code).json({ error: result.error });
    } else {
        // Send a success response with status code and message
        res.status(result.code).json({ message: result.message });
    }
}

module.exports = { getFriends, friendRequest, approveFriendRequest, deleteFriend }


