//alert("Hello from JavaScript!");
// Your rest of the code goes here

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

//import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Replace with your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAtfFfcJC1NXMV44O_4njxc3KwHlRt_7cU",
  authDomain: "lawyer-appointment-booki-5479c.firebaseapp.com",
  projectId: "lawyer-appointment-booki-5479c",
  storageBucket: "lawyer-appointment-booki-5479c.firebasestorage.app",
  messagingSenderId: "511336352654",
  appId: "1:511336352654:web:5188ebb9426ec4c04ab2df",
  measurementId: "G-8R8N7GG6N0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signUpForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const errorElement = document.getElementById("error-message");
const successElement = document.getElementById("success-message");

signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Clear all previous messages
  if (errorElement) errorElement.textContent = "";
  if (successElement) successElement.textContent = "";

  const email = emailInput.value;
  const password = passwordInput.value;
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const displayName = `${firstName} ${lastName}`;

  if (password.length < 6) {
    if (errorElement) {
      errorElement.textContent = "Password must be at least 6 characters long.";
    }
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user);

      return updateProfile(user, {
        displayName: displayName,
      });
    })
    .then(() => {
      if (successElement) {
        successElement.textContent = "Account created successfully!";
      }
    })
    .catch((error) => {
      const errorCode = error.code;

      if (!errorElement) {
        console.error("Error: HTML element with id 'error-message' not found.");
        return;
      }

      switch (errorCode) {
        case "auth/email-already-in-use":
          errorElement.textContent =
            "This email is already registered. Please sign in instead.";
          break;
        case "auth/invalid-email":
          errorElement.textContent = "The email address is not valid.";
          break;
        case "auth/weak-password":
          errorElement.textContent =
            "The password is too weak. Please choose a stronger one.";
          break;
        default:
          errorElement.textContent = `An unexpected error occurred. Please try again.`;
          console.error("Firebase Error:", error);
          break;
      }
    });
});
