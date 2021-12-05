const { Readable } = require("stream");

class StreamFromArray extends Readable {
  constructor(arr) {
    super({ objectMode: true }); // encoding: "utf-8"
    this.arr = arr;
    this.index = 0;
  }

  _read() {
    if (this.index <= this.arr.length) {
      const chunk = { data: this.arr[this.index], index: this.index };
      this.push(chunk);

      this.index = this.index + 1;
    }
    this.push(null);
  }
}

const arrStream = new StreamFromArray([
  "This is the first stream chunk",
  "This is the second stream chunk",
  "This is the third stream chunk",
  "This is the fourth stream chunk",
  "This is the fifth stream chunk",
]);

arrStream.on("data", (chunk) => {
  console.log(chunk);
});

arrStream.on("end", () => console.log("Stream ended"));
arrStream.on("error", () => process.exit(1));

arrStream.pause();

process.stdin.on("data", (chunk) => {
  const text = chunk.toString().trim();
  if (text === "c") {
    arrStream.resume();
  }

  arrStream.read();
});
