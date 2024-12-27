const { socketOp } = require("./response.sv");
const { connectedUsers, io } = require("./sockets.sv");

exports.sendNotification = (userId, message) => {
  console.log(userId, message)
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("notification", message);
    socketOp(true,`Notification sent to ${userId}: ${JSON.stringify(message)}`);
  } else socketOp(false,`User ${userId} is not connected.`);
};
