import loadPDFs from "../utils/pdfLoader.js";
import chunkText from "./chunker.js";
import fs from "fs";

async function processDocs() {
  const docs = await loadPDFs();
  let allChunks = [];

  docs.forEach(doc => {
    const chunks = chunkText(doc.text);

    chunks.forEach(chunk => {
      allChunks.push({
        text: chunk,
        source: doc.source
      });
    });
  });

  fs.writeFileSync("./data/chunks.json", JSON.stringify(allChunks, null, 2));

  console.log("Chunks saved:", allChunks.length);
}

processDocs();