import { initializeApp } from "firebase/app";

// Firebase configuration using placeholders for Hack2Skill Evaluation
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "election-ai-assistant.firebaseapp.com",
  projectId: "election-ai-assistant",
  storageBucket: "election-ai-assistant.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

export default app;
