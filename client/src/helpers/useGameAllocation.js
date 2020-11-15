import socketIOClient from "socket.io-client";
import ENDPOINT from "./server-end-point";

const ALLOCATION_EVENT = "role"; // Name of the event
const SOCKET_SERVER_URL = ENDPOINT;

const useGameAllocation = (roomId) => {
    console.log("allocation called.")
    let playerRole = 'spectator';
    // Creates a WebSocket connection
    const socket = socketIOClient(SOCKET_SERVER_URL, {
        forceNew: true,
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttempts: 10,
        transports: ['websocket'],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false,
        query: { roomId }
    });

    console.log("connection created", socket);

    socket.on(ALLOCATION_EVENT, (role) => {
        console.log("reached response")
        console.log("role is:", role);
        playerRole = role;
    });

    socket.disconnect();
    return playerRole;
};

export default useGameAllocation;

