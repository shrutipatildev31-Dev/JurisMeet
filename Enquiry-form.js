// =======================================================
// 1. FIREBASE IMPORTS AND INITIALIZATION
// =======================================================
// Ensure you have your Firebase config and initialization code here.
// These imports assume you are using the modular SDK v9 (or later).
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// IMPORTANT: REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAtfFfcJC1NXMV44O_4njxc3KwHlRt_7cU",
  authDomain: "lawyer-appointment-booki-5479c.firebaseapp.com",
  projectId: "lawyer-appointment-booki-5479c",
  storageBucket: "lawyer-appointment-booki-5479c.firebasestorage.app",
  messagingSenderId: "511336352654",
  appId: "1:511336352654:web:5188ebb9426ec4c04ab2df",
  measurementId: "G-8R8N7GG6N0",
};

// Initialize Firebase App and Database Service
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================================================
// 2. GET HTML ELEMENT REFERENCES (MUST MATCH HTML IDs)
// =======================================================
const enquiryForm = document.getElementById("Enquiry-form");
const usernameInput = document.getElementById("username"); // ID: username
const emailInput = document.getElementById("email"); // ID: email
const phoneInput = document.getElementById("phone"); // ID: phone
const messageInput = document.getElementById("message"); // ID: message
const messageElement = document.getElementById("enquiry-message-area"); // ID for feedback

// =======================================================
// 3. FORM SUBMISSION LOGIC
// =======================================================
enquiryForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // STOP the default form submission (page refresh)

  // Initial feedback while submitting
  messageElement.textContent = "Submitting your enquiry...";
  messageElement.className = "text-blue-400 text-sm mt-2";

  try {
    // Simple validation check: Ensure required fields are not empty
    if (!usernameInput.value || !emailInput.value || !messageInput.value) {
      throw new Error(
        "Please fill in all required fields (Name, Email, Message)."
      );
    }

    // 1. Collect Data from all inputs
    const enquiryData = {
      username: usernameInput.value,
      email: emailInput.value,
      phone: phoneInput.value || "N/A", // Allow phone to be optional, save 'N/A' if empty
      message: messageInput.value,

      // Metadata for tracking
      createdAt: new Date().toISOString(),
      status: "new", // Initial status
    };

    // 2. Save the document to the 'enquiries' collection
    // This automatically creates a new collection separate from 'appointments'
    await addDoc(collection(db, "enquiries"), enquiryData);

    // 3. Handle Success
    messageElement.textContent =
      "✅ Thank you! Your enquiry has been submitted.";
    messageElement.className = "text-green-500 text-sm mt-2";
    enquiryForm.reset(); // Clear the form fields
  } catch (error) {
    // 4. Handle Errors
    // Check if the error is due to missing fields (from our custom validation)
    const errorMessage = error.message.includes("fill in")
      ? error.message
      : `❌ Failed to submit enquiry. Check your network or permissions.`;

    messageElement.textContent = errorMessage;
    messageElement.className = "text-red-500 text-sm mt-2";
    console.error("Enquiry submission error: ", error);
  }
});
