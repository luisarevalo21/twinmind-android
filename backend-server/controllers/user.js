const express = require("express");
const router = express.Router();
const VerifyToken = require("../verifyToken");
const { db } = require("../firebase-admin");

const getUser = async (req, res) => {
  const { userId } = req.body;
  try {
    // Check if user already exists
    const user = await db.collection("users").doc(userId).get();
    if (!user.exists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    res.status(200).json(user.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const newUser = async (req, res) => {
  console.log("Received request to create new user:", req.body);
  const { name, email, userId } = req.body;
  console.log("Creating new user:", { name, email, userId });
  try {
    const userRef = db.collection("users");
    // Check if user already exists
    const user = await userRef.doc(userId).get();
    if (user.exists) {
      return res.status(200).json(user.data());
    }

    // Create a new user in Firebase Authentication
    await userRef.doc(userId).set({
      name: name,
      email: email,
      userId: userId,
    });

    const savedDoc = await userRef.doc(userId).get();

    if (savedDoc.exists) {
      res.status(200).json(savedDoc.data());
    } else {
      return res.status(400).json({ message: "User not created" });
    }

    // Create a new user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all the users memories and send the message to get a response from the ai
const message = async (req, res) => {
  const { userId } = req.params;

  const { message } = req.body;
  try {
    // Check if user exists
    const user = await db.collection("users").doc(userId).get();
    if (!user.exists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Update the user's message
    // await db.collection("users").doc(userId).update({
    //   message: message,
    // });

    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUser,
  newUser,
};
