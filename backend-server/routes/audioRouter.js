const express = require("express");
const audioController = require("../controllers/audio");

const router = express.Router();

// router.post("/new-audio", audioController.newAudio);
// router.post("/new-summary", audioController.newSummary);
router.post("/generate-summary", audioController.generateSummary);
router.post("/test", audioController.test);

module.exports = router;
