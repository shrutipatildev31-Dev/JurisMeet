// =======================================================
// 1. FIREBASE IMPORTS AND INITIALIZATION
// =======================================================
// These imports are for the client-side Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-functions.js";

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

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// =======================================================
// 2. GET HTML ELEMENT REFERENCES
// =======================================================
// IMPORTANT: We listen for a 'click' on the button, as the wrapper is a <div> not a <form>
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const chatContainer = document.getElementById("chat-container");

// 3. Initialize Firebase Functions service and link to the Cloud Function
const functions = getFunctions(app);
const callAI = httpsCallable(functions, "generateChatResponse");

// =======================================================
// 4. CHAT DISPLAY UTILITY
// =======================================================

/**
 * Creates and appends a message to the chat container.
 * @param {string} text - The content of the message.
 * @param {boolean} isUser - True for user message, false for AI.
 */
function displayMessage(text, isUser) {
  // Determine avatar source and background color based on sender
  const avatarSrc = isUser
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAKUFduFkl9iRuRrH-Cy1NnSuwjolqktqvmmqZ-F1IlDpm12OSPgkLqTcvoGXNUZmSkyM84529y--idwRdvm0QXk6WOzBWc_Qm0zLig7YfWniTWaj7QAiJSm7i5jldpqS_ilJVjtaN9Pv-lPvPAS4GyQHXYhu1vRRHiJEfkCXwZ7EVQ3mAFbdHbMNzAYCrPgt2lWBxEB_7Peu8m3_2TRYej2RbUFQhNh_4G9yidg7cprkzF1hnII7b3ssfOtdd5j2QdEcnSbaXUJeEg"
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuAMMSZotrBsULWAiyiX8hinvVF1w47rIrJcB7ZzGtb2Y9ACgglaihOXcJPRpduxyKKcyXB4dBu7ZFrCKGPd0PrwlXTxJUDvpBkOrjfx2RrvaVl6hqWm5t5tyZlJpkw8r4Hp41QDrgKZ54c-cEeF-sjKtsuLc6FVsHWnYebqnkMiO43xo6Uo5P-zI9PyZUtHjnAhndPFKqJUXc2PxWdm4tQX4VOjF9a1fSBmX0aGKxS9jyKlhDosCEXlg-aci_55fahiKLxnGjn9jY1Q";
  const avatarAlt = isUser ? "User Avatar" : "AI Assistant Avatar";
  const justifyClass = isUser ? "justify-end" : "justify-start";
  const bgClass = isUser
    ? "bg-primary text-white"
    : "bg-primary/10 dark:bg-primary/30 text-black/80 dark:text-white/90";

  const messageHTML = `
        <div class="flex items-start gap-3 ${justifyClass}">
            ${
              !isUser
                ? `<img alt="${avatarAlt}" class="w-8 h-8 rounded-full" src="${avatarSrc}"/>`
                : ""
            }
            <div class="${bgClass} p-3 rounded-lg max-w-md">
                <p class="text-sm">${text}</p>
            </div>
            ${
              isUser
                ? `<img alt="${avatarAlt}" class="w-8 h-8 rounded-full" src="${avatarSrc}"/>`
                : ""
            }
        </div>
    `;

  chatContainer.insertAdjacentHTML("beforeend", messageHTML);
  // Auto-scroll to the bottom of the container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// =======================================================
// 5. EVENT HANDLERS
// =======================================================

/**
 * Handles sending the message when the button is clicked.
 */
async function handleSubmission() {
  const prompt = chatInput.value.trim();

  if (!prompt) return;

  // Display user message
  displayMessage(prompt, true);
  chatInput.value = "";

  // Disable input/button while waiting for AI response
  sendButton.disabled = true;
  chatInput.disabled = true;

  try {
    // Call the secure Cloud Function
    const response = await callAI({ prompt: prompt });
    const aiText = response.data.text;

    // Display AI response
    displayMessage(aiText, false);
  } catch (error) {
    console.error("AI Service Error:", error);
    displayMessage("Error: Failed to connect to the AI assistant.", false);
  } finally {
    // Re-enable input/button
    sendButton.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
}

// Event listener for the Send Button
sendButton.addEventListener("click", handleSubmission);

// Event listener for the Enter key press in the input field
chatInput.addEventListener("keypress", (event) => {
  // Check if the Enter key was pressed (key code 13 or key 'Enter')
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default form behavior if it were a form
    handleSubmission();
  }
});

// Initial Welcome Message
window.onload = () => {
  // Clear any static content added for demonstration purposes in the HTML
  chatContainer.innerHTML = "";
  displayMessage(
    "Hi there! I am your AI Assistant. How can I help you today?",
    false
  );
};
