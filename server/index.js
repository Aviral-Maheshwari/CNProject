var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "display.html")); // Adjusted path to point directly to display.html in the current folder
});

io.on("connection", (socket) => {
  socket.on("join-message", (roomId) => {
    socket.join(roomId);
    console.log("User joined in a room : " + roomId);
  });

  socket.on("screen-data", function (data) {
    data = JSON.parse(data);
    var room = data.room;
    var imgStr = data.image;
    socket.broadcast.to(room).emit("screen-data", imgStr);
  });
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
  console.log("Started on : " + server_port);
});
