const { Server } = require("socket.io");
const { socketOp } = require("./response.sv");

const connectedUsers = new Map();
function initialize(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5500", // test html
      methods: ["GET", "POST"], 
    },
  });

  io.on("connection", (socket) => {
    socketOp(true, `User connected: ${socket.id}`);

    socket.on("register", (userId) => {
      connectedUsers.set(userId, socket.id);
      socketOp(true, `User registered: ${userId}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          socketOp(true, `User disconnected: ${userId}`);
          break;
        }
      }
    });
  });

  module.exports.io = io;
}

module.exports = { initialize, connectedUsers };
