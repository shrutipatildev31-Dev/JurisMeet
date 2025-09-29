import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getAuth,
  updateProfile,
  signOut,
  onAuthStateChanged,

  // Imports for updates
  updateEmail,
  GoogleAuthProvider,
  signInWithPopup,

  // Keep this for consistency if this script is merged with others
  // createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Replace with your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAtfFfcJC1NXMV44O_4njxc3KwHlRt_7cU",
  authDomain: "lawyer-appointment-booki-5479c.firebaseapp.com",
  projectId: "lawyer-appointment-booki-5479c",
  storageBucket: "lawyer-appointment-booki-5479c.firebasestorage.app",
  messagingSenderId: "511336352654",
  appId: "1:511336352654:web:5188ebb942ec4c04ab2df",
  measurementId: "G-8R8N7GG6N0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- DOM Elements ---
const profileContainer = document.getElementById("profile-container");
const authPrompt = document.getElementById("auth-prompt");
const userDisplayNameElement = document.getElementById("user-display-name");
const userEmailElement = document.getElementById("user-email");
const userImageElement = document.getElementById("user-image");
const profileMessageElement = document.getElementById("profile-message");

// Update Forms and Buttons
const toggleEditButton = document.getElementById("toggle-edit-btn");
const editProfileArea = document.getElementById("edit-profile-area");
const updateProfileForm = document.getElementById("update-profile-form");
const newDisplayNameInput = document.getElementById("new-display-name");
const newPhotoURLInput = document.getElementById("new-photo-url");
const updateEmailForm = document.getElementById("update-email-form");
const newEmailInput = document.getElementById("new-email");
const signOutButton = document.getElementById("sign-out-btn");

// Helper function to clear and display messages
const showMessage = (message, isError = false) => {
  if (profileMessageElement) {
    profileMessageElement.textContent = message;
    profileMessageElement.style.color = isError ? "red" : "lightgreen";
  }
};

const clearMessages = () => showMessage("");

// Function to update the profile page's visible content
const updateProfileDisplay = (user) => {
  if (userDisplayNameElement)
    userDisplayNameElement.textContent =
      user.displayName || "N/A (Update to set name)";
  if (userEmailElement) userEmailElement.textContent = user.email;

  // Set the image source; use a default if photoURL is missing
  const defaultAvatar = "https://via.placeholder.com/128x128.png?text=User";
  if (userImageElement) {
    userImageElement.src = user.photoURL || defaultAvatar;
  }

  // Pre-fill update forms
  if (newDisplayNameInput) newDisplayNameInput.value = user.displayName || "";
  if (newPhotoURLInput) newPhotoURLInput.value = user.photoURL || "";
  if (newEmailInput) newEmailInput.value = user.email;
};

// -----------------------------------------------------------
// 🔥 CORE: TRACK USER STATE (onAuthStateChanged)
// -----------------------------------------------------------

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    if (profileContainer) profileContainer.style.display = "flex"; // Use flex to center content
    if (authPrompt) authPrompt.style.display = "none";

    updateProfileDisplay(user);
  } else {
    // User is signed out.
    if (profileContainer) profileContainer.style.display = "none";
    if (authPrompt) authPrompt.style.display = "block";
    // Redirect to signin page after a moment if desired
    // setTimeout(() => window.location.href = 'signin.html', 2000);
  }
});

// -----------------------------------------------------------
// 🔥 UI TOGGLE LOGIC
// -----------------------------------------------------------

if (toggleEditButton && editProfileArea) {
  toggleEditButton.addEventListener("click", () => {
    const isHidden =
      editProfileArea.style.display === "none" ||
      editProfileArea.style.display === "";
    editProfileArea.style.display = isHidden ? "block" : "none";
    toggleEditButton.querySelector("span:last-child").textContent = isHidden
      ? "Hide Editor"
      : "Edit Profile";
    clearMessages();
  });
}

// -----------------------------------------------------------
// 🔥 1. UPDATE NAME and IMAGE (photoURL) LOGIC
// -----------------------------------------------------------

if (updateProfileForm) {
  updateProfileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessages();

    const newDisplayName = newDisplayNameInput.value.trim();
    const newPhotoURL = newPhotoURLInput.value.trim();
    const user = auth.currentUser;

    if (!user) {
      showMessage("Error: You must be logged in to update your profile.", true);
      return;
    }

    updateProfile(user, {
      displayName: newDisplayName || user.displayName,
      photoURL: newPhotoURL || user.photoURL,
    })
      .then(() => {
        // Success: Update the display and show a message
        updateProfileDisplay(auth.currentUser);
        showMessage("Name and/or Image updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        showMessage(`Error updating profile: ${error.message}`, true);
      });
  });
}

// -----------------------------------------------------------
// 🔥 2. UPDATE EMAIL LOGIC (Requires Re-authentication)
// -----------------------------------------------------------

if (updateEmailForm) {
  updateEmailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessages();

    const newEmail = newEmailInput.value.trim();
    const user = auth.currentUser;

    if (!user) {
      showMessage("Error: You must be logged in.", true);
      return;
    }
    if (newEmail === user.email) {
      showMessage("The new email is the same as the current one.");
      return;
    }

    try {
      // Step 1: Re-authenticate the user (Required for email/password updates)
      showMessage(
        "Verifying identity... A pop-up will appear to re-authenticate with Google."
      );

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // Step 2: Update the email
      await updateEmail(user, newEmail);

      // Success
      showMessage(
        `Email updated to ${newEmail} successfully! A verification link has been sent to the new address.`
      );
      // Note: The onAuthStateChanged listener will refresh the display
      updateProfileDisplay(user);
    } catch (error) {
      let message = "Error updating email.";
      console.error("Email Update Error:", error);

      switch (error.code) {
        case "auth/requires-recent-login":
          message = "Please sign out and sign in again to update your email.";
          break;
        case "auth/email-already-in-use":
          message = "This email is already linked to another account.";
          break;
        case "auth/invalid-email":
          message = "The new email address format is invalid.";
          break;
        case "auth/cancelled-popup-request":
          message = "Email update cancelled.";
          break;
        default:
          message = `Update failed: ${error.message}`;
      }

      showMessage(message, true);
    }
  });
}

// -----------------------------------------------------------
// 🔥 SIGN OUT LOGIC
// -----------------------------------------------------------

if (signOutButton) {
  signOutButton.addEventListener("click", (event) => {
    event.preventDefault();
    clearMessages();

    signOut(auth)
      .then(() => {
        showMessage("You have been signed out successfully.");
        // onAuthStateChanged handles the display change
      })
      .catch((error) => {
        console.error("Sign Out Error:", error);
        showMessage("Error signing out. Please try again.", true);
      });
  });
}
