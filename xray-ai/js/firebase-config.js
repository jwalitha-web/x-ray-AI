// ================================================================
//  Firebase Configuration — X-Ray AI Screening Assistant
// ================================================================

const firebaseConfig = {
  apiKey: "AIzaSyBqNljVKLkmAa3grYUyI4ET1sofuTVwLdI",
  authDomain: "x-ray-ai-41bf1.firebaseapp.com",
  projectId: "x-ray-ai-41bf1",
  storageBucket: "x-ray-ai-41bf1.firebasestorage.app",
  messagingSenderId: "222671808020",
  appId: "1:222671808020:web:19854bf864f05acf106901",
  measurementId: "G-X4BVRRPQTV"
};

// Real Firebase — Dynamic ESM Imports for zero-build-step compatibility
const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
const { getStorage } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js");
const { getAnalytics } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default null;
