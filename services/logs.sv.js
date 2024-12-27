const fs = require("fs");
const moment = require("moment");
const path = require("path");
const { success, error, logAll, appendLog, warning } = require("./response.sv");
const { setRoleData } = require("./redis.sv");

exports.logData = (...data) => {
  try {
    const startTime = Date.now();
    const currentStamp = moment().utcOffset(330).format("YYYYMMDD_HHmmss");
    const currentDate = moment().utcOffset(330).format("YYYYMMDD");

    const [req, res] = data;
    logAll(req.method, req.originalUrl);

    res.on("finish", () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      if (duration > 500) warning(req.originalUrl, duration);
      const folderPath = path.join(__dirname, "../logs");
      const filePath = path.join(folderPath, `daily-log-${currentDate}.log`);
      const obj = {
        METHOD: req.method,
        URL: req.originalUrl,
        SOURCE: req.headers["user-agent"],
        TIMESTAMP: currentStamp,
        DURATION: duration + "ms",
      };
      const logContent = `${JSON.stringify(obj)},\n`;

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      fs.appendFile(filePath, logContent, "utf8", (err) => {
        if (err) success(false, err);
        else appendLog(obj.URL, obj.DURATION)
      });
    });
  } catch (err) {
    error(err);
  }
};
