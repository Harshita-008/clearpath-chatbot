import fs from "fs";
import getEmbedding from "./embedder.js";

async function run() {
  const chunks = JSON.parse(fs.readFileSync("./data/chunks.json"));

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Embedding ${i + 1} / ${chunks.length}`);
    chunks[i].embedding = await getEmbedding(chunks[i].text);
  }

  fs.writeFileSync("./data/embeddings.json", JSON.stringify(chunks, null, 2));

  console.log("Embeddings saved!");
}

run();