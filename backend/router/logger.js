const fs = require("fs");

function logRouting(data) {
  fs.appendFileSync(
    "./router_log.json",
    JSON.stringify(data) + "\n"
  );
}

module.exports = logRouting;