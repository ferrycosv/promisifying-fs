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

const filePath = path.join(__dirname, process.argv[2]);
log(1, filePath);

const toAppend = process.argv[3];
log(2, toAppend);

const numberOfTimes = Number(process.argv[4]);
log(3, numberOfTimes);

log(4, "reading old contents ...");

const readFilePromise = util.promisify(fs.readFile);
const appendFilePromise = util.promisify(fs.appendFile);

readFilePromise(filePath, "utf8")
  .then((oldContents) => {
    const arrayAppend = [];
    for (let i = 1; i <= numberOfTimes; i++) {
      log(4 + i, `appending ...`);
      arrayAppend.push(appendFilePromise(filePath, toAppend));
    }
    Promise.all(arrayAppend)
      .then(() => {
        log(numberOfTimes + 5, "reading new contents ...");
        readFilePromise(filePath, "utf-8")
          .then((newContents) => {
            log(numberOfTimes + 6, "asserting file contents ...");
            const expectedContents =
              oldContents + toAppend.repeat(numberOfTimes);
            assert.strictEqual(newContents, expectedContents);
            log(numberOfTimes + 7, "\033[32mpass!\x1b[0m");
            fs.appendFileSync(
              __filename,
              `\n// pass: ${new Date().toLocaleString()}`
            );
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));

// pass: 5/29/2020, 8:52:42 PM