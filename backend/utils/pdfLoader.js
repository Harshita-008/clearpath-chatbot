const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

async function extractTextFromPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map(item => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}

async function loadPDFs() {
  const docsPath = path.join(__dirname, "../../docs");
  const files = fs.readdirSync(docsPath);

  const documents = [];

  for (const file of files) {
    if (file.endsWith(".pdf")) {
      const filePath = path.join(docsPath, file);
      const text = await extractTextFromPDF(filePath);

      documents.push({
        source: file,
        text
      });
    }
  }

  return documents;
}

module.exports = loadPDFs;