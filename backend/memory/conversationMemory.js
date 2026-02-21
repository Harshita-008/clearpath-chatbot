const memoryStore = {};

const MAX_HISTORY = 5; // last 5 exchanges

function getHistory(sessionId) {
  return memoryStore[sessionId] || [];
}

function addToHistory(sessionId, userMessage, botResponse) {
  if (!memoryStore[sessionId]) {
    memoryStore[sessionId] = [];
  }

  memoryStore[sessionId].push({
    user: userMessage,
    bot: botResponse
  });

  // keep only last N exchanges
  if (memoryStore[sessionId].length > MAX_HISTORY) {
    memoryStore[sessionId].shift();
  }
}

function clearHistory(sessionId) {
  memoryStore[sessionId] = [];
}

export { getHistory, addToHistory, clearHistory };