import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import ENDPOINT from "./server-end-point";

const NEW_CHAT_MESSAGE_EVENT = "chat"; // Name of the event
// const SOCKET_SERVER_URL = ENDPOINT;
const SOCKET_SERVER_URL = "localhost:5000";


const useChat = (roomId) => {
    const [messages, setMessages] = useState([]); // Sent and received messages
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

        // Listens for incoming messages
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id,
            };
            setMessages((messages) => [...messages, incomingMessage]);
        });

        // Destroys the socket reference
        // when the connection is closed
        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    // Sends a message to the server that
    // forwards it to all users in the same room
    const sendMessage = (messageBody) => {
        try {
            socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
                body: messageBody,
                senderId: socketRef.current.id,
            });
        } catch (err) {
            alert(err);
        }


    };


    return { messages, sendMessage };
};

export default useChat;