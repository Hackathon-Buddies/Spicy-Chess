const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;

io.on("connection", socket => {

    console.log("A user has connected!");

    socket.on("joinRoom", room => {
        socket.join(room);
    });

    socket.on("chat", ({room,msg}) => {
        socket.to(room).emit("chat",msg);
    });

    socket.on("gameState", ({room, data}) => {
        socket.to(room).emit("gameState",data);
    });

});

server.listen(port, () => console.log("server running on port:" + port));