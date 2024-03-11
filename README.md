# ShareSphere Server

![logopic](./public/logopic.png)

**The Share Sphere App is a social media platform that allows users to share posts and interact with each other. This README file provides an overview of the websites's features and functionalities.**

## running the server
- Download the repository to your computer
- Changeg the directory in terminal to Server
- Install dependencies (for running the app) using **npm install**
- Create config file containing: the port you would like to run on, the domain of the website and the MongoDB connection string.
- Open MongoDB on your computer
- Before you run the server, please run the following command in terminal: **node initDB.js**. This will **initialize the database** with: 7 default users, 25 posts from the diffrent users and comments.
- Run the server using **npm start**.
- Our suggestion is to login with the user: **user name: tal144155, password: tal2024**, even though it does not matter so much.

## Features and functionality
- After running the server, tou will be able to serve our site (with the domain you chose) or apllication (in android).
- After logging in, you will see your **Feed page**. In this page you will be able to see the most recent posts on ShareSphere, give each post a like (they deserve it!), comment and share.
- On the feed page you will be able to add a new post (please notice a post must contain text and image).
- When pressing your profile pic or name on the left-bar you will be redirected to your personal page.
- On your personal page you can see your own posts, edit\delete them, add comments and view your own friends.
- Also, in you profile page you can edit your own details, or delete your account.
- When pressing another users picture\name in the post, you will be redirected to his personal page.
- **please notice:** when you enter another users profile page, if you are not friends, you will be able to send him a friend request but you will not be able to his posts. only when you are friends, you can see his posts **and his friends** in the profile page.