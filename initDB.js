const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");


const jsonFilePath = "./json/users.json"; // Update with the path to your JSON file

async function insertDataFromJson() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    // Read data from JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    // Insert data into User collection
    await User.insertMany(jsonData);

    console.log('Data inserted successfully.');

    // Close the MongoDB connection
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// Run the script to insert data
insertDataFromJson();