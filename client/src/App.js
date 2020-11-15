import './index.css';
import React, { useState } from "react";
import ChatRoom from "./components/chatRoom.js";
import Game from './components/game.js';
import './App.css';

function App() {

    const [room, setRoom] = useState("global");
    const [initialRoom, setInitialRoom] = useState("");
    const [showGameScreen, setShowGameScreen] = useState(false);
    const [username, setUsername] = useState("");


    const handleRoomNameChange = (event) => {
        setInitialRoom(event.target.value);
    };

    const handleRoomJoin = () => {
        if (initialRoom && username) {
            setRoom(initialRoom);
            setShowGameScreen(true);
        }
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    // const sendUsername

    const gameContent = (<div className="outer-container">
        <div className="join-wrapper">
            <Game room={room} username={username}/>
        </div>
        <ChatRoom room={room} username={username} />

    </div>);


    const homeContent = (
        <div className="outer-container">
            <h1>Welcome to Spicy Chess</h1>
            <div className="join-wrapper">

                <h2>What shall we call you?</h2>

                <div>
                    <input
                        type="text"
                        placeholder="your username..."
                        value={username}
                        onChange={handleUsernameChange}
                        className="text-input-field"
                    />
                </div>

                <h2>Find a worthy opponent</h2>

                <div>
                    <input
                        type="text"
                        placeholder="Your room's name..."
                        value={initialRoom}
                        onChange={handleRoomNameChange}
                        className="text-input-field"
                    />
                    <button onClick={() => handleRoomJoin()}>Join Room</button>
                </div>
            </div>
            <ChatRoom room={room} username={username} />

        </div>);
    return (
        <>
            {showGameScreen ? gameContent : homeContent}
        </>
    );
}

export default App;