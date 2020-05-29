// require dependencies
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const util = require("util");

// declare constants
const EXERCISE_NAME = path.basename(__filename);
const START = Date.now();

// declare logging function
const log = (logId, value) =>
  console.log(`\nlog ${logId} (${Date.now() - START} ms):\n`, value);

// --- main script ---
console.log(`\n--- ${EXERCISE_NAME} ---`);

const fileName1 = process.argv[2];
const filePath1 = path.join(__dirname, fileName1);
log(1, filePath1);

const fileName2 = process.argv[3];
const filePath2 = path.join(__dirname, fileName2);
log(2, filePath2);

log(3, `reading ${fileName1} ...`);
const fileContents1 = fs.readFileSync(filePath1, "utf-8");

log(4, `reading ${fileName2} ...`);
const fileContents2 = fs.readFileSync(filePath2, "utf-8");

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

Promise.all([
  readFilePromise(filePath1, `utf-8`),
  readFilePromise(filePath2, `utf-8`),
])
  .then((readFiles) => {
    log(6, "comparing file contents ...");
    const fileOneIsLonger = readFiles[0].length > readFiles[1].length;
    if (fileOneIsLonger) {
      log(6, `writing to ${fileName2} ...`);
      writeFilePromise(filePath2, readFiles[0])
        .then(() => {
          log(7, `reading ${fileName2} ...`);
          readFilePromise(filePath2, "utf-8")
            .then((newFileContents2) => {
              log(8, "asserting ...");
              assert.strictEqual(readFiles[0], newFileContents2);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    } else {
      log(6, `writing to ${fileName1} ...`);
      writeFilePromise(filePath1, readFiles[1])
        .then(() => {
          log(7, `reading ${fileName1} ...`);
          readFilePromise(filePath1, "utf-8")
            .then((newFileContents1) => {
              log(8, "asserting ...");
              assert.strictEqual(readFiles[1], newFileContents1);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
    log(9, "\033[32mpass!\x1b[0m");
    fs.appendFileSync(__filename, `\n// pass: ${new Date().toLocaleString()}`);
  })
  .catch((err) => console.error(err));

// pass: 5/29/2020, 8:19:40 PM