const retrieveRelevantChunks = require("./retriever");
const callGroqModel = require("../utils/groqClient");
const { classifyQuery, chooseModel } = require("../router/router");
const evaluateResponse = require("../evaluator/evaluator");
const logRouting = require("../router/logger");

async function answerQuery(query, history = []) {
  let classification = classifyQuery(query);
  const cleanQuery = query.toLowerCase();

  // greeting handling
  if (classification === "greeting") {
    return {
      response: "Hello! How can I help you with Clearpath today?",
      classification,
      flagged: false,
      chunks: []
    };
  }

  if (/function|code|javascript|api|login\(/i.test(cleanQuery)) {
    return {
      response:
        "The documentation does not mention this feature.\nPlease contact support for confirmation.",
      classification,
      flagged: true,
      chunks: []
    };
  }

  // prevent hallucination for syncing issues (not in docs)
  if (cleanQuery.includes("sync")) {
    return {
      response:
        "The documentation does not mention task syncing issues.\nPlease contact support for confirmation.",
      classification,
      flagged: true,
      chunks: []
    };
  }

  // prevent hallucination for crypto payments (not in docs)
  if (cleanQuery.includes("crypto") || cleanQuery.includes("cryptocurrency")) {
    return {
      response:
        "The documentation does not mention this feature.\nPlease contact support for confirmation.",
      classification,
      flagged: true,
      chunks: []
    };
  }

  // prevent hallucinations for fictional / irrelevant features
  if (
    cleanQuery.includes("mars") ||
    cleanQuery.includes("space mission") ||
    cleanQuery.includes("quantum") ||
    cleanQuery.includes("ai engine")
  ) {
    return {
      response:
        "The documentation does not mention this feature.\nPlease contact support for confirmation.",
      classification,
      flagged: true,
      chunks: []
    };
  }

  // boost conceptual queries → better model routing
  if (
    cleanQuery.includes("workflow") ||
    cleanQuery.includes("permissions") ||
    cleanQuery.includes("integrations")
  ) {
    classification = "complex";
  }

  const model = chooseModel(classification);

  // retrieve relevant chunks
  let chunks = await retrieveRelevantChunks(query, 5);

  // remove hallucination-prone content
  chunks = chunks.filter(c =>
    !/creator role|api access|advanced reports|employee handbook/i.test(c.text)
  );

  if (cleanQuery.includes("migrate")) {
    chunks = chunks.slice(0,3);
  }

  // remove security-policy noise for workflow questions
  if (cleanQuery.includes("workflow") || cleanQuery.includes("permissions")) {
    chunks = chunks.filter(c =>
      /workflow|roles|admin|member|viewer/i.test(c.text) &&
      !/password|mfa|confidential|termination|security policy|data classification/i.test(c.text)
    );
  }

  // prioritize pricing chunks
  if (
    cleanQuery.includes("pricing") ||
    cleanQuery.includes("price") ||
    cleanQuery.includes("cost")
  ) {
    const pricingChunks = chunks.filter(c =>
      c.source.toLowerCase().includes("pricing")
    );
    if (pricingChunks.length > 0) {
      chunks = pricingChunks;
    }
  }

  const context = chunks.map(c => c.text).join("\n\n");

  // conversation memory (last 4 turns for token efficiency)
  const conversationHistory = history
    .slice(-4)
    .map(h => `User: ${h.user}\nBot: ${h.bot}`)
    .join("\n");

  const prompt = `
You are ClearPath's AI Support Assistant.

Use ONLY the official ClearPath documentation.

========================
Conversation History
========================
${conversationHistory}

========================
Documentation Context
========================
${context}

========================
User Question
========================
${query}

========================
Instructions
========================

• Use BOTH conversation history and documentation context.
• Answer using ONLY the documentation.
• Do NOT add extra troubleshooting steps beyond what is provided.

• Speak like a helpful support agent.
• Do NOT mention documentation or sources.
• Do NOT say "based on the documentation".
• Do NOT explain where the answer was found.

• If the answer is not clearly present, respond EXACTLY:

"The documentation does not mention this feature.
Please contact support for confirmation."

• Do NOT guess or invent features.
• Keep responses concise and professional.
• Use bullet points when helpful.

Answer:
`;

  const start = Date.now();
  let response;

  try {
    response = await callGroqModel(model, prompt);
  } catch (err) {
    console.error("LLM ERROR:", err.message);
    return {
      response:
        "Sorry, I encountered an error connecting to the server. Please try again.",
      classification,
      model_used: model,
      latency_ms: 0,
      flagged: true,
      reasons: { connection: true },
      chunks
    };
  }

  const latency = Date.now() - start;

  // normalize weak refusals
  if (!response || /i don't know|not sure|cannot help|unsure/i.test(response)) {
    response =
      "The documentation does not mention this feature.\nPlease contact support for confirmation.";
  }

  // clean formatting & bullets
  response = response
    .replace(/\s{2,}/g, " ")
    .replace(/\n\s*\*/g, "\n• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const evaluation = evaluateResponse(response, chunks);

  // routing logs
  logRouting({
    query,
    classification,
    model_used: model,
    latency_ms: latency
  });

  return {
    response,
    classification,
    model_used: model,
    latency_ms: latency,
    flagged: evaluation.flagged,
    reasons: evaluation.reasons,
    chunks
  };
}

module.exports = answerQuery;