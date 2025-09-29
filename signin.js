// The correct Firebase SDK imports for a sign-in page
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,

  // 🔥 NEW IMPORTS FOR GOOGLE SIGN-IN
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// IMPORTANT: Replace this with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAtfFfcJC1NXMV44O_4njxc3KwHlRt_7cU",
  authDomain: "lawyer-appointment-booki-5479c.firebaseapp.com",
  projectId: "lawyer-appointment-booki-5479c",
  storageBucket: "lawyer-appointment-booki-5479c.firebasestorage.app",
  messagingSenderId: "511336352654",
  appId: "1:511336352654:web:5188ebb9426ec4c04ab2df",
  measurementId: "G-8R8N7GG6N0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get references to your HTML elements using their IDs
const signInForm = document.getElementById("signin-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorElement = document.getElementById("error-message");
const successElement = document.getElementById("success-message");

// 🔥 NEW: Get reference to the Google Sign-In button
const googleSignInButton = document.getElementById("google-signin-btn");

// Helper function for redirection
const handleSuccess = (message) => {
  if (successElement) {
    successElement.textContent = message;
  }
  setTimeout(() => {
    window.location.href = "profile.html"; // Redirect to profile page after login
  }, 1500);
};

// Helper function for error display
const handleError = (error, element) => {
  const errorCode = error.code;

  if (!element) {
    console.error("Error: HTML element for message not found.");
    return;
  }

  let message = `An unexpected error occurred. Please try again.`;

  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      message = "Invalid email or password. Please try again.";
      break;
    case "auth/user-disabled":
      message = "This account has been disabled.";
      break;
    case "auth/invalid-email":
      message = "The email address is not valid.";
      break;
    // Specific to Google/Popup errors
    case "auth/popup-closed-by-user":
      message = "Sign-in window was closed before completion.";
      break;
    default:
      console.error("Firebase Error:", error);
  }
  element.textContent = message;
};

// -----------------------------------------------------------------
// 1. Email/Password Sign In Logic (Existing)
// -----------------------------------------------------------------

if (signInForm) {
  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Clear any previous messages
    if (errorElement) errorElement.textContent = "";
    if (successElement) successElement.textContent = "";

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        handleSuccess("Sign in successful!");
      })
      .catch((error) => {
        handleError(error, errorElement);
      });
  });
}

// -----------------------------------------------------------------
// 2. 🔥 Google Sign In Logic (New)
// -----------------------------------------------------------------

if (googleSignInButton) {
  googleSignInButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Clear messages
    if (errorElement) errorElement.textContent = "";
    if (successElement) successElement.textContent = "";

    const provider = new GoogleAuthProvider();

    // 🔥 FIX: FORCES GOOGLE TO SHOW THE ACCOUNT CHOOSER PROMPT 🔥
    // This is necessary to allow users to switch Google accounts after a sign-out.
    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithPopup(auth, provider)
      .then(() => {
        // Handle successful sign-in
        handleSuccess("Google Sign in successful!");
      })
      .catch((error) => {
        // Handle errors
        handleError(error, errorElement);
      });
  });
}
