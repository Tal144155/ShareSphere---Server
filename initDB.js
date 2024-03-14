const mongoose = require("mongoose");
const fs = require("fs");
const PostService = require("./services/post");
const UserService = require("./services/user");
const CommentService = require("./services/comment");
const base64Img = require("base64-img");

const jsonFilePath = "./json/users.json";
const jsonPostPath = "./json/posts.json";

//creating the custom env
const customENV = require("custom-env");

//connecting to env wanted
customENV.env(process.env.NODE_ENV, "./config");

async function collectionExists(collectionName) {
  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.some((collection) => collection.name === collectionName);
}

async function insertDataFromJson() {
  try {
    // Replace here with your own connection string!!!!
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const usersCollectionExists = await collectionExists("users");
    const postsCollectionExists = await collectionExists("posts");
    const commentsCollectionExists = await collectionExists("comments");
    if (
      usersCollectionExists ||
      postsCollectionExists ||
      commentsCollectionExists
    ) {
      await mongoose.disconnect();
      return;
    }
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

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

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

insertDataFromJson();
