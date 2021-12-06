const dotenv = require("dotenv");

dotenv.config();

const { createReadStream, createWriteStream } = require("fs");
const readStream = createReadStream(process.env.READ_FILE);
const writeStream = createWriteStream(process.env.WRITE_FILE, {
  // highWaterMark: 162802
});

readStream.on("data", (chunk) => {
  const result = writeStream.write(chunk);

  if (!result) {
    console.log("backpressure");
    readStream.pause();
  }
});

readStream.on("error", (err) => {
  console.log("An err has occured");
  console.error(err);
});

readStream.on("end", () => {
  writeStream.end();
});

writeStream.on("drain", () => {
  console.log("drained");
  readStream.resume();
});

writeStream.on("close", () => {
  process.stdout.write("file copied \n");
});
