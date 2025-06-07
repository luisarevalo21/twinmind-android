const express = require("express");
const router = express.Router();
const { db, FieledValue } = require("../firebase-admin");
// };
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const { parseAudioToText } = require("../openai");
const path = require("path");
// const { newPrompt } = require("./memory");

// const newAudio = async (req, res) => {
//   try {
//     const { userId, memoryId, memoryTitle } = req.body;
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     const parsedText = await parseAudioToText(req.file.filename);

//     let memoryRef = null;
//     //creating a new memeroy and sending back the memoryid
//     if (!memoryId) {
//       // Save the parsed text to the database
//       memoryRef = await db.collection("memories").add({
//         userId: userId,
//         transcript: [parsedText],
//         summary: "",
//         title: memoryTitle || "Untitled Memory",
//         date: new Date().toISOString(),
//       });
//       await memoryRef.update({ memoryId: memoryRef.id });
//     } else {
//       memoryRef = await db.collection("memories").where("memoryId", "==", memoryId).get();
//       if (memoryRef.empty) {
//         return res.status(404).json({ message: "Memory not found" });
//       }
//       memoryRef = memoryRef.docs[0].ref;
//       // If memoryId is provided, update the existing memory
//       await memoryRef.update({
//         transcript: FieledValue.arrayUnion(parsedText),
//         memoryTitle: memoryTitle || "Untitled Memory",
//       });
//     }

//     return res.status(200).json({ text: parsedText, memoryId: memoryRef.id, memoryTitle: memoryTitle });
//   } catch (err) {
//     console.error("Error processing audio:", err);
//     return res.status(500).json({ message: "Error processing audio" });
//   }

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .audioCodec("pcm_s16le")
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .run();
  });
}

const test = async (req, res) => {
  console.log("Received request to test audio processing:", req.body);
  return res.status(200).json({ message: "Audio processing test successful" });
};
const generateSummary = async (req, res) => {
  //audio being sent transcripted to text and send it abc k\

  const { userId } = req.body;
  const { filename } = req.file || {};

  try {
    if (!filename) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // In your controller (e.g., generateSummary)
    const inputPath = req.file.path;
    const outputPath = inputPath.replace(".wav", "_converted.wav");
    await convertToWav(inputPath, outputPath);
    const responseText = await parseAudioToText(path.basename(outputPath));

    if (!responseText) {
      return res.status(500).json({ message: "Error generating summary" });
    }

    return res.status(200).json({ text: responseText });
    // db.collection('memories')
  } catch (err) {
    console.error("Error generating summary:", err);
    return res.status(500).json({ message: "Error processing summary" });
  }
};

// const newSummary = async (req, res) => {
//   const { userId, memoryId } = req.body;
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     //passes entire audio file to openai for parsing
//     const parsedText = await parseAudioToText(req.file.filename);

//     const response = await newPrompt(req, res, parsedText);
//     if (!response || !response.summary) {
//       return res.status(500).json({ message: "Error generating summary" });
//     }

//     const memoryRef = await db.collection("memories").where("memoryId", "==", memoryId).get();
//     if (memoryRef.empty) {
//       return res.status(404).json({ message: "Memory not found" });
//     }
//     const memoryDoc = memoryRef.docs[0];
//     await memoryDoc.ref.update({
//       summary: response.summary,
//     });

//     return res.status(200).json({ text: response.summary });
//   } catch (err) {
//     return res.status(500).json({ err: "Error processing summary" });
//   }
// };
module.exports = {
  // newAudio,
  // newSummary,
  generateSummary,
  test,
};
