function checkNoContext(chunks) {
  if (!chunks || chunks.length === 0) return true;

  // check if top similarity score is too low
  return chunks[0].score < 0.30;
}

function checkRefusal(response) {
  const refusalPatterns =
    /i don't know|cannot help|not available|contact support|unsure/i;

  return refusalPatterns.test(response);
}

// domain-specific hallucination detection
function checkHallucination(response, chunks) {
  const contextText = chunks.map(c => c.text.toLowerCase()).join(" ");

  const words = response.toLowerCase().split(/\W+/);

  // look for unusual terms not in context
  const suspicious = words.filter(
    word =>
      word.length > 6 &&
      !contextText.includes(word) &&
      !["clearpath", "project", "task", "team"].includes(word)
  );

  return suspicious.length > 5;
}

function evaluateResponse(response, chunks) {
  const noContext = checkNoContext(chunks);
  const refusal = checkRefusal(response);
  const hallucination = checkHallucination(response, chunks);

  return {
    flagged: noContext || refusal || hallucination,
    reasons: {
      noContext,
      refusal,
      hallucination,
    },
  };
}

export default evaluateResponse;