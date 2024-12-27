const csvParser = require("csv-parser");

exports.parseCSV = async (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = require("stream");
    const readableFile = new stream.PassThrough();
    readableFile.end(buffer);

    readableFile
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};