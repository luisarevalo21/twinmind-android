const { db } = require("../firebase-admin");
//gets a memory by id

// const { parseRequest } = require("../openai");
const getMemoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await db.collection("memories").where("userId", "==", id).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No memories found for this user" });
    }

    const memories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sortedMemories = memories.sort((a, b) => b.date - a.date); // Sort by date descending

    return res.status(200).json(sortedMemories);
  } catch (error) {
    console.error("Error getting memory by ID:", error);
    return res.status(500).json({ message: "Error retrieving memory" });
  }
};
const getMemoryDetailsById = async (req, res) => {
  const { memoryId } = req.params;
  try {
    const memoryDoc = await db.collection("memories").doc(memoryId).get();
    if (!memoryDoc.exists) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const memoryData = memoryDoc.data();
    return res.status(200).json({
      id: memoryDoc.id,
      ...memoryData,
    });
  } catch (error) {
    console.error("Error getting memory details by ID:", error);
    return res.status(500).json({ message: "Error retrieving memory details" });
  }
};

//generates a summary based on the text sent and the prompt stored in memory
// const newPrompt = async (req, res, parsedText = null) => {
//   const { memoryId, userId, text } = req.body;

//   const messages = [
//     {
//       role: "system",
//       content:
//         "You are an assistant that summarizes transcripts into structured JSON. Give me tl;dr section, a transcript analysis, transcipt analysis will just be a formmatted string and context information",
//     },
//   ];
//   try {
//     //genreate summary on text text sent
//     //duplicated coude i know, couldn't get it to work otherwise
//     if (memoryId && typeof parsedText === "string") {
//       const memoryDoc = await db.collection("memories").doc(memoryId).get();
//       if (!memoryDoc.exists) {
//         return res.status(404).json({ message: "Memory not found" });
//       }
//       const memoryData = memoryDoc.data();

//       messages.push({
//         role: "user",
//         content: `${text}\n\n Transcript: \n${parsedText}`,
//       });

//       const response = await parseRequest(messages);

//       const summaryJson = JSON.parse(response);

//       return { summary: summaryJson };
//     }
//     //if memory id was sent only
//     if (memoryId) {
//       if (!text) return res.status(400).json({ message: "no text sent" });
//       //get memory docs references
//       const memoryDoc = await db.collection("memories").doc(memoryId).get();

//       if (!memoryDoc.exists) {
//         return res.status(404).json({ message: "Memory not found" });
//       }

//       //gets the memory doc data
//       const memoryData = memoryDoc.data();

//       const { transcript, summary } = memoryData;

//       messages.push({
//         role: "user",
//         content: `${text}\n\n Transcript: \n${parsedText === null ? transcript : parsedText}`,
//       });

//       const response = await parseRequest(messages);

//       const summaryJson = JSON.parse(response);

//       return res.status(200).json({ summary: summaryJson });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: "Error processing request" });
//   }
//   //if a userId was sent isntead fetch all the memoryies of the user and send to oepn ai based on the question asked
//   //send back the text formatted

//   if (userId) {
//     try {
//       const userMemoriesSnapshot = await db.collection("memories").where("userId", "==", userId).get();
//       if (userMemoriesSnapshot.empty) {
//         return res.status(404).json({ message: "No memories found for this user" });
//       }

//       const memories = userMemoriesSnapshot.docs.map(doc => doc.data());

//       const transcripts = memories.map(memory => memory.transcript).join("\n\n");

//       messages.push({
//         role: "user",
//         content: `${text}\n\n Transcripts: \n${transcripts}`,
//       });

//       const response = await parseRequest(messages);

//       const summaryJson = JSON.parse(response);

//       return res.status(200).json({ summary: summaryJson });
//     } catch (error) {
//       console.error("Error retrieving user memories:", error);
//       return res.status(500).json({ message: "Error retrieving user memories" });
//     }
//   }
// };

module.exports = {
  getMemoryById,
  getMemoryDetailsById,
};
// newPrompt,
