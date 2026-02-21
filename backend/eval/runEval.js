import dotenv from "dotenv";
import answerQuery from "../rag/answerQuery.js";
import testCases from "./testCases.js";

dotenv.config();

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

    await new Promise(res => setTimeout(res, 1500));
  }

  console.log("\n=========================");
  console.log(`Passed: ${passed}/${testCases.length}`);
  console.log("=========================\n");
})();