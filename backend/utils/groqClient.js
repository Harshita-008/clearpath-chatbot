import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// load backend/.env explicitly
dotenv.config({ path: path.join(__dirname, "../.env") });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log("Groq key loaded:", !!GROQ_API_KEY);

async function streamGroqModel(model, prompt, onToken, retryCount = 0) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: "You are a helpful Clearpath support assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        stream: true
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "stream"
      }
    );

    return new Promise((resolve, reject) => {
      let fullText = "";

      response.data.on("data", chunk => {
        const lines = chunk.toString().split("\n").filter(Boolean);

        for (const line of lines) {
          const message = line.replace(/^data: /, "");

          if (message === "[DONE]") {
            resolve(fullText);
            return;
          }

          try {
            const parsed = JSON.parse(message);
            const token = parsed.choices[0]?.delta?.content;

            if (token) {
              fullText += token;
              onToken(token); // send token to UI
            }
          } catch {}
        }
      });

      response.data.on("error", reject);
    });

  } catch (error) {

    // HANDLE RATE LIMIT
    if (error.response?.status === 429 && retryCount < 3) {
      console.log("Rate limited. Retrying in 5 seconds...");
      await new Promise(r => setTimeout(r, 5000));
      return streamGroqModel(model, prompt, onToken, retryCount + 1);
    }

    console.error("Streaming LLM Error:", error.message);
    throw error;
  }
}

export default streamGroqModel;