import './index.css';
import React, { useState } from "react";
import ChatRoom from "./components/chatRoom.js";
import Game from './components/game.js';
import './App.css';

function App() {

    const [room, setRoom] = useState("global");
    const [initialRoom, setInitialRoom] = useState("");
    const [showGameScreen, setShowGameScreen] = useState(false)


    const handleRoomNameChange = (event) => {
        setInitialRoom(event.target.value);
    };

    const handleRoomJoin = () => {
        if(initialRoom){
            setRoom(initialRoom);
            setShowGameScreen(true);
        }
    }

    const gameContent = (<div className="outer-container">
        <div className="join-wrapper">
            <Game room={room} />
        </div>
        <ChatRoom room={room} />

    </div>);


    const homeContent = (
        <div className="outer-container">
            <h1>Welcome to Spicy Chess</h1>
            <div className="join-wrapper">
                <h2>Find a worthy opponent</h2>

                <div>
                    <input
                        type="text"
                        placeholder="Join Room..."
                        value={initialRoom}
                        onChange={handleRoomNameChange}
                        className="text-input-field"
                    />
                    <button onClick={() => handleRoomJoin()}>Join Room</button>
                </div>
            </div>
            <ChatRoom room={room} />

        </div>);
    return (
        <>
            {showGameScreen ? gameContent : homeContent}
        </>
    );
}

export default App;