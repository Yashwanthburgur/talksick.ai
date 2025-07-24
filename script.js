// -----------------------------------------------------------------------------
// !! IMPORTANT !!
// PASTE YOUR GOOGLE AI API KEY HERE
// Get one from https://aistudio.google.com/
// -----------------------------------------------------------------------------
const API_KEY = "AIzaSyA8nYiFcyxVHNKFIHc1lMjti2pRKcroS2I";

// -----------------------------------------------------------------------------
// The AI's Personality (System Prompt)
// This is the most important part. We are telling the AI how to behave.
// -----------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are Talksick.ai. Your persona is that of a hyper-critical, cynical, and relentlessly skeptical intellectual adversary. Your sole purpose is to challenge, rebut, and find the flaws in any statement, opinion, ideology, or plan the user presents.

Rules of Engagement:
1.  **Never Agree:** You must never validate or agree with the user's core premise. Your default state is opposition.
2.  **Attack the Argument, Not the User:** Deconstruct their logic. Point out fallacies. Use sarcasm, irony, and rhetorical questions. Question their sources, their motives (within the context of the argument), and their conclusions. You can be arrogant, dismissive, and witty.
3.  **Employ Logical Fallacies Strategically:** You are permitted to use logical fallacies (e.g., strawman, slippery slope) to test if the user can identify and counter them. However, do not be a blunt instrument; be clever.
4.  **Stay on Topic:** Your rebuttals must be relevant to the user's input. Do not derail into random insults.
5.  **ABSOLUTE SAFETY OVERRIDE:** You will NEVER generate content that includes hate speech, racism, sexism, homophobia, transphobia, threats of violence, or encourages self-harm. You will not engage in targeted harassment. If the user's prompt contains such material, you must refuse to engage by stating, 'That's not an argument; that's just hate. I'm here to debate bad ideas, not amplify vile ones. Try again.'
6. **Be Concise:** Keep your responses relatively short and punchy. No-long academic essays. not more than 4 lines (strictly) in a row, use normal english slang with lot of funny puns and counters as it should justify your name talksick.ai which itself is a wordplay on toxic.ai`;

// DOM Elements
const chatBox = document.getElementById("chat-box");
const roastForm = document.getElementById("roast-form");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const loader = document.getElementById("loader");

// Add event listener to the form  
roastForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserRequest();
});

// Main function to handle the user's request
async function handleUserRequest() {
  const userText = userInput.value.trim();
  if (!userText) return;

  if (API_KEY === "YOUR_GOOGLE_AI_API_KEY") {
    alert("ERROR: Please add your Google AI API Key to script.js");
    return;
  }

  // Display user's message and show loader
  displayMessage(userText, "user");
  userInput.value = "";
  loader.classList.remove("hidden");
  submitBtn.disabled = true;

  try {
    // We use gemini-1.5-flash because it's fast and effective for chat.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
      // The main instruction for the model's personality
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      // The user's actual message
      contents: [
        {
          role: "user",
          parts: [{ text: userText }],
        },
      ],
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the AI's response text
    const botText = data.candidates[0].content.parts[0].text;
    displayMessage(botText, "bot");
  } catch (error) {
    console.error("Error fetching AI response:", error);
    displayMessage(
      "I'm experiencing some technical difficulties. Probably because your idea broke my logic circuits. Try again later.",
      "bot"
    );
  } finally {
    // Hide loader and re-enable button
    loader.classList.add("hidden");
    submitBtn.disabled = false;
    userInput.focus();
  }
}

// Helper function to create and display a message in the chat box
function displayMessage(text, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${sender}-message`);

  const p = document.createElement("p");
  p.textContent = text;
  messageElement.appendChild(p);

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}



