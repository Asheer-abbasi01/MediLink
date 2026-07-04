import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithAI = async (req, res) => {
  const { message, history } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.json({
      response: "Hello! I am your MediLink AI Assistant. Currently, the server does not have a `GEMINI_API_KEY` configured, so I am running in demo mode. I can help guide you through the platform (like explaining how to book appointments, manage bills, or view medicine stock). Please remember: I am NOT a substitute for professional medical advice, diagnosis, or treatment."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are the MediLink AI Assistant, a helpful virtual assistant on the MediLink healthcare management system. You answer user queries about the platform, explain features, and provide general health information. You MUST include a disclaimer when users ask about symptoms or medical issues, stating that you are not a substitute for professional medical advice and they should consult a doctor. Do NOT prescribe drugs, do NOT diagnose diseases, and do NOT make definitive medical claims."
    });

    // Format chat history for Gemini SDK structure
    let formattedHistory = history && Array.isArray(history) 
      ? history.map(h => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content || h.text || "" }]
        }))
      : [];

    // The Gemini SDK requires the chat history to start with a 'user' message.
    // If the welcome message is from the 'model' (which is common in chat UIs),
    // we discard any leading 'model' messages.
    const firstUserIndex = formattedHistory.findIndex(h => h.role === "user");
    if (firstUserIndex !== -1) {
      formattedHistory = formattedHistory.slice(firstUserIndex);
    } else {
      formattedHistory = [];
    }

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (err) {
    console.error("Gemini AI integration error:", err);
    res.status(500).json({ error: "Error connecting to AI service. Please try again." });
  }
};
