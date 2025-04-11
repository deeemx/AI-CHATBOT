const HUGGING_FACE_API_KEY = "PUT IN API KEY";
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

// SENDING CHAT MESSAGE TO REALM
function sendChatMessage(message) {
  client.queue("text", {
    type: "chat",
    needs_translation: false,
    source_name: "",
    xuid: "",
    platform_chat_id: "",
    message: message,
    filtered_message: "" // added decensorship 
  });
}

// GRAB BOTS RESPONSE
async function fetchChatbotResponse(userMessage) {
  const payload = { inputs: userMessage };
  const headers = {
    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,

    "Content-Type": "application/json"
  };

  try { 

    const response = await fetch(API_URL, {
      method: "POST",

      headers: headers,
      body: JSON.stringify(payload)
    });

    console.log("Response Status Code:", response.status);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Full API Response:", JSON.stringify(data, null, 2)); // LOG IT FRRR

    // RETURN IF UNABLE TO READ
    if (data && data[0] && data[0].generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    } else {
      console.error("Unexpected API response structure:", data);
      return "The chatbot couldn't process the input. Please try again.";
    }
  } catch (error) {
    console.error("Error finding response:", error);
    return "Error occured.";
  }
}

// TRACK AI STATE
let aiEnabled = true; // AI ENABLED BY DEFAULT CAN CHANGE IDK

// Command to toggle AI 
client.on("text", (packet) => {
  const message = packet.message;

  if (message === "?toggleAI") {
    aiEnabled = !aiEnabled;
    sendChatMessage(`AI is now ${aiEnabled ? "enabled" : "disabled"}.`);
  }
});


client.on("text", async (packet) => {
  const message = packet.message;
  const sender = packet.source_name;

  
  if (sender === clientArgs.username) return;

  // replace KEYWORD with word
  if (!message.startsWith("KEYWORD")) return;

  // ai disabler
  if (!aiEnabled) {

    console.log("AI is now disabled, ignoring all commands");
    return;
  }

  console.log(`Message from ${sender}: ${message}`);

  
  const userMessage = message.slice("Spyza".length).trim();
  console.log("User Message Sent to API:", userMessage); 

  
  const sanitizedMessage = userMessage.replace(/[^\w\s?.,!]/g, "");
  console.log("Sanitized User Message:", sanitizedMessage); 

  // GRAB AI BOT RESPONSE bc the other mightnt work
  const botResponse = await fetchChatbotResponse(sanitizedMessage);

  console.log("Bot Response:", botResponse); // logger

  // SEND RESPONSE TO MC
  sendChatMessage(botResponse);
});
