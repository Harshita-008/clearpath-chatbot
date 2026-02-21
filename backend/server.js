import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import loadPDFs from "./utils/pdfLoader.js";
import retrieveRelevantChunks from "./rag/retriever.js";
import answerQuery from "./rag/answerQuery.js";
import { getHistory, addToHistory } from "./memory/conversationMemory.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Clearpath chatbot running");
});

// load & parse PDFs
app.get("/load", async (req, res) => {
  try {
    const docs = await loadPDFs();
    res.json({ count: docs.length });
  } catch (err) {
    console.error("Load error:", err);
    res.status(500).json({ error: "Failed to load documents" });
  }
});

// vector search endpoint
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const results = await retrieveRelevantChunks(query);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// chat endpoint with memory
app.get("/chat", async (req, res) => {
  try {
    const query = req.query.q;
    const sessionId = req.query.session || "default";

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    const history = getHistory(sessionId);

    const result = await answerQuery(query, history);

    addToHistory(sessionId, query, result.response);

    res.json(result);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      response: "Server error. Please try again.",
      flagged: true
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);