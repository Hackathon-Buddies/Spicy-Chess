import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import ENDPOINT from "./server-end-point";

const ALLOCATION_EVENT = "role"; // Name of the event
// const SOCKET_SERVER_URL = ENDPOINT;
const SOCKET_SERVER_URL = "localhost:5000";

const useGameAllocation = (roomId) => {
    const [playerRole, setPlayerRole] = useState('spectator');
    const socketRef = useRef();

    useEffect(() => {

        // Creates a WebSocket connection
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
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

        socketRef.current.on(ALLOCATION_EVENT, (role) => {
            setPlayerRole(role);
        });
        return () => {
            socketRef.current.disconnect();
        };

    }, []);

    return playerRole;
};

export default useGameAllocation;

