function classifyQuery(query) {
  const cleanQuery = query.toLowerCase().trim();
  const wordCount = cleanQuery.split(/\s+/).length;

  // detect greetings even inside phrases
  const greetings = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good evening",
    "good afternoon"
  ];

  if (greetings.some(g => cleanQuery.startsWith(g))) {
    return "greeting";
  }

  // complex intent indicators
  const complexKeywords =
    /error|issue|failed|problem|not working|can't|unable|why|explain|steps|troubleshoot|migrate|setup|permissions|workflow/i;

  // simple intent indicators
  const simpleKeywords =
    /price|pricing|cost|what is|how many|does clearpath|invite|export|secure|offline/i;

  // multi-intent detection
  if (cleanQuery.includes(" and ") && wordCount > 6) {
    return "complex";
  }

  // keyword complexity
  if (complexKeywords.test(cleanQuery)) {
    return "complex";
  }

  // long query → complex reasoning
  if (wordCount > 12) {
    return "complex";
  }

  // simple lookup
  if (simpleKeywords.test(cleanQuery)) {
    return "simple";
  }

  return "simple";
}

function chooseModel(classification) {
  return classification === "complex"
    ? "llama-3.3-70b-versatile"
    : "llama-3.1-8b-instant";
}

module.exports = { classifyQuery, chooseModel };