// The correct Firebase SDK imports for a sign-in page
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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
// Note: You must add the id="signin-form", id="error-message", and id="success-message"
// to your HTML as instructed below.
const signInForm = document.getElementById("signin-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorElement = document.getElementById("error-message");
const successElement = document.getElementById("success-message");

// Add a submit event listener to the form
signInForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevents the page from refreshing on form submission

  // Clear any previous messages
  if (errorElement) errorElement.textContent = "";
  if (successElement) successElement.textContent = "";

  const email = emailInput.value;
  const password = passwordInput.value;

  // Use Firebase's signInWithEmailAndPassword function to authenticate the user
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Sign-in successful
      const user = userCredential.user;
      console.log("Signed in as:", user.email);

      if (successElement) {
        successElement.textContent = "Sign in successful!! ";
      }

      // Optional: Redirect the user to a secure page after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    })
    .catch((error) => {
      // Handle and display specific Firebase sign-in errors
      const errorCode = error.code;

      if (!errorElement) {
        console.error("Error: HTML element with id 'error-message' not found.");
        return;
      }

      switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorElement.textContent =
            "Invalid email or password. Please try again.";
          break;
        case "auth/user-disabled":
          errorElement.textContent = "This account has been disabled.";
          break;
        case "auth/invalid-email":
          errorElement.textContent = "The email address is not valid.";
          break;
        default:
          errorElement.textContent = `An unexpected error occurred. Please try again.`;
          console.error("Firebase Error:", error);
          break;
      }
    });
});
