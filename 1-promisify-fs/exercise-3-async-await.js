// require dependencies
const fs = require(`fs`);
const path = require(`path`);
const assert = require(`assert`);
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
const fileToRead = path.join(__dirname, fileName1);
log(1, fileToRead);

const fileName2 = process.argv[3];
const fileToAppend = path.join(__dirname, fileName2);
log(2, fileToAppend);

log(3, `reading original contents from ${fileName2} ...`);

const readFilePromise = util.promisify(fs.readFile);
const appendFilePromise = util.promisify(fs.appendFile);

const main = async () => {
  try {
    const oldContents = await readFilePromise(fileToAppend, `utf-8`);
    log(4, `reading from ${fileName1} ...`);
    const contentToAppend = await readFilePromise(fileToRead, `utf-8`);
    log(5, `writing to ${fileName2} ...`);
    await appendFilePromise(fileToAppend, contentToAppend);
    log(6, `reading from ${fileName2} ...`);
    const newContent = await readFilePromise(fileToAppend, `utf-8`);
    log(7, `asserting ...`);
    assert.strictEqual(newContent, oldContents + contentToAppend);
    log(8, "\033[32mpass!\x1b[0m");
    fs.appendFileSync(__filename, `\n// pass: ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error(err);
  }
};
main();

// pass: 5/29/2020, 6:55:01 PM