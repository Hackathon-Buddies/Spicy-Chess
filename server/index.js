const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;
var userList = [];

io.on("connection", socket => {

    console.log("A user has connected!");

    // join room
    const { roomId, username } = socket.handshake.query;

    const user = {
        roomId: roomId,
        username: username
    };

    console.log("user ->", user.roomId, user.username);

    socket.join(roomId);
    console.log("joined room: ",roomId, "with username: ", username);
    userList.push(user);

    console.log("users in room:",roomId," are:",userList);

    var playersInRoom = [];
    for (i = 0; i < userList.length; i++) {
        if(userList[i].username !== undefined && userList[i].username !== '' && userList[i].username !== "undefined"){
                playersInRoom.push(userList[i]);

        }
    }
    
    io.in(roomId).emit("playerList", playersInRoom);
    console.log("actual players: ",playersInRoom);

    

    // Listen for message

    socket.on("chat", (data) => {
        io.in(roomId).emit("chat", data);
        console.log("chat data: ",data)
    });


    // Listen for game state changes

    socket.on("gameState", (data) => {
        io.in(roomId).emit("gameState", data);
        console.log(data);
        
    });


    // Disconnect

    socket.on("disconnect", () => {
        socket.leave(roomId);
    });

});

server.listen(port, () => console.log("server running on port:" + port));