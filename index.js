const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");

// load env file
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
if (fs.existsSync(envFile)) dotenv.config({ path: envFile });
else console.error(`Environment file ${envFile} not found!`);

const { port } = require("./config/main.config");

require("./database/redis.conn");
require("./database/mongo.conn");

const { success, error } = require("./services/response.sv");
const usersRoutes = require("./routes/users.route");
const empRoutes = require("./routes/emp.route");
const logsSv = require("./services/logs.sv");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // testing html
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use((req, res, next) => {
  logsSv.logData(req, res);
  next();
});

app.use("/users", usersRoutes);
app.use("/emp", empRoutes);

const server = require("http").createServer(app);
require("./services/sockets.sv").initialize(server);

// Global handlers
process.on("uncaughtException", async (err) => {
  error(`Uncaught Exception: ${err.message}`);
  process.exit(1); 
});

process.on("unhandledRejection", async (reason) => {
  const errorMessage =
    reason instanceof Error ? reason.stack || reason.message : reason;
  error(`Unhandled Rejection: ${errorMessage}`);
  process.exit(1); 
});

// server
server.listen(port, async () => {
  success(true, `SERVER :: MODE :: ${process.env.NODE_ENV} :: PORT: ${port}`);
});
