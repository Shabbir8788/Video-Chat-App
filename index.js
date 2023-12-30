const express = require("express");
const app = express();
const http = require("http");
const expressServer = http.createServer(app);
const { v4: uuidv4 } = require("uuid");

const PORT = 3000;

// socket configuration
const { Server } = require("socket.io");
const io = new Server(expressServer);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

expressServer.listen(PORT, () => {
  console.log(`Server is running successfully at http://localhost:${PORT}`);
});
