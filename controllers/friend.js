const friendModel = require("../models/friend");
const userService = require("../services/user");
const friendService = require("../services/friend");

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
      let friendsArr = [];
      for (const user of friends) {
        const new_user = {
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          pic: user.pic,
        };
        friendsArr.push(new_user);
      }
      // Send a success response with the friends array and status code 200
      res.status(200).json(friendsArr);
    }
  } catch (error) {
    // Handle any unexpected errors and send a 500 response
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

const hasBeenSentRequesr = async (req, res) => {
  try {
    const req_user_name = req.headers.username;
    const id = req.params.id;
    // Get the user making the request
    const userToCheck = await userService.getUserName(req_user_name);
    if (!userToCheck) {
      return res.status(404).json({ error: "User not found" });
    }
    // Get the user to check for friend requests
    const userId = await userService.getUserName(id);
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the friend request exists
    const hasSentRequest = friendService.isRequested(userId[0], userToCheck[0]._id);
    res.status(200).json({ answer: hasSentRequest });
  } catch (error) {
    console.error("Error in hasBeenSentRequesr:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFriendsRequest = async (req, res) => {
  try {
    const req_user_name = req.headers.username;
    const id = req.params.id;
    const friends = await friendModel.getFriendRequests(id);

    // Check if there is an error
    if (friends.error) {
      // Send an error response with the error code and message
      res.status(404).json({ error: "user not found" });
    } else {
      let friendsArr = [];
      for (const user of friends) {
        const new_user = {
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          pic: user.pic,
        };
        friendsArr.push(new_user);
      }
      // Send a success response with the friends array and status code 200
      res.status(200).json(friendsArr);
    }
  } catch (error) {
    // Handle any unexpected errors and send a 500 response
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

const friendRequest = async (req, res) => {
  const req_user_name = req.headers.username;
  const res_user_name = req.params.id;
  const result = await friendModel.friendRequest(req_user_name, res_user_name);
  // Check if there is an error
  if (result.error) {
    // Send an error response with the error code and message
    res.status(result.code).json({ error: result.error });
  } else {
    // Send a success response with status code and message
    res.status(result.code).json({ message: result.message });
  }
};

const approveFriendRequest = async (req, res) => {
  const user = req.params.id;
  const friend = req.params.fid;
  const result = await friendModel.approveFriendRequest(user, friend);
  // Check if there is an error
  if (result.error) {
    // Send an error response with the error code and message
    res.status(result.code).json({ error: result.error });
  } else {
    // Send a success response with status code and message
    res.status(result.code).json({ message: result.message });
  }
};

const deleteFriend = async (req, res) => {
  const user = req.params.id;
  const friend = req.params.fid;
  const result = await friendModel.deleteFriend(user, friend);
  // Check if there is an error
  if (result.error) {
    // Send an error response with the error code and message
    res.status(result.code).json({ error: result.error });
  } else {
    // Send a success response with status code and message
    res.status(result.code).json({ message: result.message });
  }
};

const areFriends = async (req, res) => {
  const user_name_1 = req.params.id;
  const user_name_2 = req.params.fid;
  const result = await friendService.areFriends(user_name_1, user_name_2);
  res.json({ message: result });
}

module.exports = {
  getFriends,
  friendRequest,
  approveFriendRequest,
  deleteFriend,
  getFriendsRequest,
  hasBeenSentRequesr,
  areFriends
};
