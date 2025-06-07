const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const fs = require("fs");

const parseAudioToText = async audioFilePath => {
  try {
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(`uploads/${audioFilePath}`),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error parsing audio file:", error);
    return new Error("Failed to parse audio file");
  }
};

const parseRequest = async message => {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "gpt-4",
      messages: message,
      temperature: 0.2,
    });

    const reply = chatCompletion.choices[0].message.content;
    return reply;
  } catch (error) {
    console.log("error occured", error);

    return new Error(error.message || "Failed to parse request");
  }
};
module.exports = {
  parseAudioToText,
  parseRequest,
};
