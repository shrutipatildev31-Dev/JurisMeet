// 1. Core Firebase Imports (Use your existing list and add the Firestore ones)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Your existing Firebase Config
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
const db = getFirestore(app); // <-- This line initializes Firestore

// You won't need the 'auth' object for this page, but keep it if you use it later
// const auth = getAuth(app);

// =======================================================
// 3. FORM SUBMISSION LOGIC
// =======================================================

const appointmentForm = document.getElementById("appointment-form");
const messageElement = document.getElementById("appointment-message-area");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const caseTypeSelect = document.getElementById("case-type");

// FIX APPLIED HERE: Changed "description" to "notes" to match your HTML
const descriptionInput = document.getElementById("notes");

appointmentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevents page refresh on submission

  // Clear previous messages and show loading state (Tailwind classes)
  messageElement.textContent = "Submitting your appointment...";
  messageElement.className = "text-blue-500 text-sm mt-2";

  try {
    // Collect Data from all inputs
    const appointmentData = {
      fullName: nameInput.value,
      email: emailInput.value,
      phoneNumber: phoneInput.value,
      caseType: caseTypeSelect.value,
      caseDescription: descriptionInput.value, // Now correctly pulls the value

      // Metadata for tracking
      createdAt: new Date().toISOString(),
      status: "pending_review",
    };

    // Basic validation check (e.g., ensure case type is selected)
    if (
      appointmentData.caseType === "Select a case type" ||
      appointmentData.caseType === ""
    ) {
      throw new Error("Please select a valid type of legal case.");
    }

    // Save Data to Firestore in the 'appointments' collection
    // This assumes 'db' is correctly initialized in the global scope
    const docRef = await addDoc(
      collection(db, "appointments"),
      appointmentData
    );

    // Success Feedback
    messageElement.textContent =
      "✅ Appointment successfully booked! We will contact you shortly.";
    messageElement.className = "text-green-500 text-sm mt-2";
    appointmentForm.reset(); // Clear the form

    console.log("Appointment saved with ID: ", docRef.id);
  } catch (error) {
    // Error Feedback
    const errorMessage = error.message.includes("case")
      ? error.message
      : `Failed to book appointment. Please check your network or try again.`;

    messageElement.textContent = `❌ ${errorMessage}`;
    messageElement.className = "text-red-500 text-sm mt-2";

    console.error("Firestore error: ", error);
  }
});
