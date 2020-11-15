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
    console.log("joined room: ",roomId);

    // rooms returns a Set !
    var rooms = io.sockets.adapter.rooms;
    var roomMembers = rooms.get(roomId);
    var roomSize = roomMembers.size;

    if(roomMembers && roomSize >= 2) {
        console.log("all players", roomMembers)
        var memberItr = roomMembers.keys()

        var player1Id = memberItr.next().value;
        var player2Id = memberItr.next().value;

        socket.broadcast.to(player1Id).emit('role','player1');
        console.log(player1Id,"is now white in room:", roomId);
        socket.broadcast.to(player2Id).emit('role','player2');
        console.log(player2Id,"is now black in room:", roomId);
    }
    

    // Listen for message

    socket.on("chat", (data) => {
        io.in(roomId).emit("chat", data);
        console.log("chat data: ",data)
    });


    // Listen for game state changes

    // let gameStateData = {
    //     squares: initialiseChessBoard(),
    //     whiteFallenSoldiers: [],
    //     blackFallenSoldiers: [],
    //     player: 1,
    //     sourceSelection: -1,
    //     status: '',
    //     turn: 'white',
    //     pieces: {
    //       white : [],
    //       black: []
    //     },
    //     gameOver: false,
    //     playerRole: useGameAllocation(props.room)
    // }

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