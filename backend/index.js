import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const API_URL = process.env.API_URL || "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.MODEL || "llama-3.3-70b-versatile";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat API",
      version: "1.0.0",
      description: "ChatGPT API Backend",
    },
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!API_KEY) {
    return res.status(500).json({ 
      error: "API key not configured. Please add GROQ_API_KEY or OPENAI_API_KEY to your .env file" 
    });
  }

  try { 
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: message }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      throw new Error(data.error?.message || "Failed to get response from AI");
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to get response from AI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log(`Using API: ${API_URL}`);
  console.log(`Using model: ${MODEL}`);
});
