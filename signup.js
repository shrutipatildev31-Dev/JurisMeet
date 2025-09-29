// alert("Hello from JavaScript!");
// Your rest of the code goes here

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  // New imports for Google Sign-In
  GoogleAuthProvider,
  signInWithPopup,
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

// --- DOM Elements ---
const signUpForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const errorElement = document.getElementById("error-message");
const successElement = document.getElementById("success-message");

// New element for Google Sign-Up button (Ensure this ID is in your HTML)
const googleSignUpButton = document.getElementById("google-signup-btn");

// Helper function to clear messages
const clearMessages = () => {
  if (errorElement) errorElement.textContent = "";
  if (successElement) successElement.textContent = "";
};

// --- Email/Password Sign Up Logic ---
signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMessages();

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

      // Update the user's profile with first and last name
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

// ------------------------------------
// --- Google Sign Up Logic ---
// ------------------------------------

if (googleSignUpButton) {
  googleSignUpButton.addEventListener("click", (event) => {
    event.preventDefault();
    clearMessages();

    // 1. Create a Google Auth Provider instance
    const provider = new GoogleAuthProvider();

    // You can optionally add scopes for additional permissions
    // provider.addScope('profile');
    // provider.addScope('email');

    // 2. Sign in with the provider using a pop-up window
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken; // If you need the token
        const user = result.user;

        // The user is signed in!
        console.log("Google Sign Up Successful:", user);

        if (successElement) {
          successElement.textContent = `Welcome, ${user.displayName}! You've successfully signed up with Google.`;
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        // const errorMessage = error.message;

        if (!errorElement) {
          console.error(
            "Error: HTML element with id 'error-message' not found."
          );
          return;
        }

        switch (errorCode) {
          case "auth/popup-closed-by-user":
            errorElement.textContent =
              "Sign up cancelled. The sign-in window was closed.";
            break;
          case "auth/cancelled-popup-request":
            errorElement.textContent = "Sign up cancelled. Please try again.";
            break;
          case "auth/account-exists-with-different-credential":
            // This is a common one if a user already signed up with email/password
            // and tries to use the same email with Google.
            errorElement.textContent =
              "An account already exists with this email address. Please sign in with your original method or link your accounts.";
            break;
          default:
            errorElement.textContent = `Google Sign Up failed: ${errorCode}. Please try again.`;
            console.error("Firebase Google Auth Error:", error);
            break;
        }
      });
  });
} else {
  console.warn(
    "Element with ID 'google-signup-btn' not found. Google sign-up functionality will not be available."
  );
}
