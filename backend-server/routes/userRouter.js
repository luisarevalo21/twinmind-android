const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

// // Get all users
router.get("/", userController.getUser);

router.post("/newUser", userController.newUser);
// router.post("/:userId/message", userController.message);
module.exports = router;
