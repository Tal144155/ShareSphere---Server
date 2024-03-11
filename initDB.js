const mongoose = require("mongoose");
const fs = require("fs");
const PostService = require("./services/post");
const UserService = require("./services/user");
const CommentService = require("./services/comment");
const base64Img = require("base64-img");

const jsonFilePath = "./json/users.json";
const jsonPostPath = "./json/posts.json";

async function insertDataFromJson() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Read data from JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

    // update to use insert with user service.
    for (const user of jsonData) {
      const { user_name, password, first_name, last_name, pic } = user;
      const base64EncodedPic = base64Img.base64Sync(pic);
      await UserService.createUser(
        user_name,
        password,
        first_name,
        last_name,
        base64EncodedPic
      );
    }

    const jsonDataPosts = JSON.parse(fs.readFileSync(jsonPostPath, "utf-8"));
    for (const postData of jsonDataPosts) {
      const { user_name, first_name, last_name, pic, profile, content } =
        postData;
      const base64EncodedPic = base64Img.base64Sync(pic);
      const base64EncodedProfile = base64Img.base64Sync(profile);
      const newPost = await PostService.createPost(
        user_name,
        first_name,
        last_name,
        base64EncodedPic,
        base64EncodedProfile,
        content
      );

      for (const comment of postData.comments) {
        const base64EncodedProfile = base64Img.base64Sync(comment.profile);
        await CommentService.createComment(
          newPost._id,
          comment.user_name,
          comment.first_name,
          comment.last_name,
          base64EncodedProfile,
          comment.content
        );
      }
    }

    console.log("Data inserted successfully.");

    // Close the MongoDB connection
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

// Run the script to insert data
insertDataFromJson();
