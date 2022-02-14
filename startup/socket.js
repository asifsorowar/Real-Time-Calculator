module.exports = () => {
  const io = require("socket.io")(process.env.SOCKET_PORT, {
    cors: {
      origin: process.env.CLIENT,
    },
  });

  io.on("connection", (socket) => {
    console.log("new device connected");

    socket.on("setUpdate", (data) => {
      io.emit("getUpdate", data);
    });

    socket.on("disconnected", () => console.log("one device removed"));
  });
};
