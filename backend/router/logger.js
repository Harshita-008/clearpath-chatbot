import fs from "fs";

function logRouting(data) {
  fs.appendFileSync(
    "./router_log.json",
    JSON.stringify(data) + "\n"
  );
}

export default logRouting;