const express = require("express");
const router = express.Router();
const { db, FieledValue } = require("../firebase-admin");

const { parseAudioToText } = require("../openai");
const { newPrompt } = require("./memory");

const newAudio = async (req, res) => {
  try {
    const { userId, memoryId, memoryTitle } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const parsedText = await parseAudioToText(req.file.filename);

    let memoryRef = null;
    //creating a new memeroy and sending back the memoryid
    if (!memoryId) {
      // Save the parsed text to the database
      memoryRef = await db.collection("memories").add({
        userId: userId,
        transcript: [parsedText],
        summary: "",
        title: memoryTitle || "Untitled Memory",
        date: new Date().toISOString(),
      });
      await memoryRef.update({ memoryId: memoryRef.id });
    } else {
      memoryRef = await db.collection("memories").where("memoryId", "==", memoryId).get();
      if (memoryRef.empty) {
        return res.status(404).json({ message: "Memory not found" });
      }
      memoryRef = memoryRef.docs[0].ref;
      // If memoryId is provided, update the existing memory
      await memoryRef.update({
        transcript: FieledValue.arrayUnion(parsedText),
        memoryTitle: memoryTitle || "Untitled Memory",
      });
    }

    return res.status(200).json({ text: parsedText, memoryId: memoryRef.id, memoryTitle: memoryTitle });
  } catch (err) {
    console.error("Error processing audio:", err);
    return res.status(500).json({ message: "Error processing audio" });
  }
};

const newSummary = async (req, res) => {
  const { userId, memoryId } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    //passes entire audio file to openai for parsing
    const parsedText = await parseAudioToText(req.file.filename);

    const response = await newPrompt(req, res, parsedText);
    if (!response || !response.summary) {
      return res.status(500).json({ message: "Error generating summary" });
    }

    const memoryRef = await db.collection("memories").where("memoryId", "==", memoryId).get();
    if (memoryRef.empty) {
      return res.status(404).json({ message: "Memory not found" });
    }
    const memoryDoc = memoryRef.docs[0];
    await memoryDoc.ref.update({
      summary: response.summary,
    });

    return res.status(200).json({ text: response.summary });
  } catch (err) {
    return res.status(500).json({ err: "Error processing summary" });
  }
};
module.exports = {
  newAudio,
  newSummary,
};
