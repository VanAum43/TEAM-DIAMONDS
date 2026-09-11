/* ==========================================================
   CropWise — firebase-config.js
   Firebase SDK Initialization for Authentication & Firestore DB
   ========================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyDYpqY9Bv7SuUYfLNRGyQqJExbGxmEPPo8",
  authDomain: "cropwise-6d9b2.firebaseapp.com",
  projectId: "cropwise-6d9b2",
  storageBucket: "cropwise-6d9b2.firebasestorage.app",
  messagingSenderId: "84991254368",
  appId: "1:84991254368:web:cd8a1ec17cb2d14630c805",
  measurementId: "G-V95Y6GJRDG"
};

// Initialize Firebase using the Compat SDK loaded in your HTML
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  console.log("Firebase initialized successfully for CropWise.");
} else {
  console.warn("Firebase SDK is missing. Please ensure Firebase script tags are included in your HTML.");
}
