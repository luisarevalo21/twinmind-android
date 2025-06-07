# TwinMind Android App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Features

- **Google Sign-In:** Users can sign in with Google. Sign-in is fully functional and user data is added to the database.
- **Audio Recording & Transcription:** Users can record audio messages. After recording, the audio is transcribed to text using OpenAI Whisper and the transcription is displayed in the app.
- **Audio Playback:** Playback is available within the app after recording.
- **File-based Routing:** Uses Expo Router for navigation.

## Known Issues

- **Video Recording:** Video recording is not working properly at this time.
- **Audio Recording:** Audio recording and playback are functional, but advanced features (like waveform) are not yet implemented.

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

You can open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (for most features except those requiring custom native code)

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn More

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
