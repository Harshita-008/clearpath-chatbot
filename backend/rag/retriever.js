import fs from "fs";
import cosineSimilarity from "./similarity.js";
import getEmbedding from "./embedder.js";

const data = JSON.parse(fs.readFileSync("./data/embeddings.json"));

async function retrieveRelevantChunks(query, topK = 5) {
  const queryEmbedding = await getEmbedding(query);

  const scored = data.map(chunk => ({
    text: chunk.text,
    source: chunk.source,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

export default retrieveRelevantChunks;