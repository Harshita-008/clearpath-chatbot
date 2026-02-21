require("dotenv").config();
const answerQuery = require("../rag/answerQuery");
const testCases = require("./testCases");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log("\n Running AI Evaluation...\n");

  let passed = 0;

  for (const test of testCases) {
    await sleep(5000);

    const result = await answerQuery(test.query);

    const responseText = result.response.toLowerCase();

    const pass = test.mustInclude.some(str =>
      responseText.includes(str.toLowerCase())
    ) || (
      test.mustNotInclude &&
      !test.mustNotInclude.some(str =>
        responseText.includes(str.toLowerCase())
      )
    );

    if (pass) {
      console.log(`PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`FAIL: ${test.name}`);
      console.log("Query:", test.query);
      console.log("Response:", result.response);
      console.log();
    }

    // avoid rate limit
    await new Promise(res => setTimeout(res, 1500));
  }

  console.log("\n=========================");
  console.log(`Passed: ${passed}/${testCases.length}`);
  console.log("=========================\n");
})();