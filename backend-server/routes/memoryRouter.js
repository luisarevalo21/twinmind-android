const express = require("express");
const memoryController = require("../controllers/memory");

const router = express.Router();

router.get("/:id", memoryController.getMemoryById);
router.get("/details/:memoryId", memoryController.getMemoryDetailsById);

// router.post("/new-prompt", memoryController.newPrompt);

module.exports = router;
