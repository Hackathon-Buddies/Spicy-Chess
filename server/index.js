const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;

io.on("connection", socket => {

    console.log("A user has connected!");

    // join room
    const { roomId } = socket.handshake.query;

    socket.join(roomId);
    console.log("joined room: ",roomId)

    // Listen for message

    socket.on("chat", (data) => {
        io.in(roomId).emit("chat", data);
        console.log("chat data: ",data)
    });


    // Listen for game state changes
    socket.on("gameState", (data) => {
        io.in(roomId).emit("gameState", data);
    });

    socket.on("disconnect", () => {
        socket.leave(roomId);
    });

});

server.listen(port, () => console.log("server running on port:" + port));