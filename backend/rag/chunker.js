function chunkText(text, size = 450, overlap = 80) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += size - overlap) {
    const chunk = words.slice(i, i + size).join(" ");
    chunks.push(chunk);
  }

  return chunks;
}

module.exports = chunkText;