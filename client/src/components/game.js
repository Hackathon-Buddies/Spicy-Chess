import React from 'react';

import '../index.css';
import Board from './board.js';
import FallenSoldierBlock from './fallen-soldier-block.js';
import initialiseChessBoard from '../helpers/board-initialiser.js';
import Knight from '../pieces/knight';
import Queen from '../pieces/queen';
import King from '../pieces/king';
import Pawn from '../pieces/pawn';
import Bishop from '../pieces/bishop';
import Rook from '../pieces/rook';
import socketIOClient from "socket.io-client";
import ENDPOINT from "../helpers/server-end-point";
const GAME_STATE_EVENT = "gameState"; // Name of the event
const PLAYER_LIST_EVENT = "playerList";
const SOCKET_SERVER_URL = ENDPOINT;


export default class Game extends React.Component {
  constructor(props) {
    super();
    this.state = {
      squares: initialiseChessBoard(),
      whiteFallenSoldiers: [],
      blackFallenSoldiers: [],
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white',
      pieces: {
        white : [],
        black: []
      },
      gameOver: false,
      playerList : [],
      lastEventGif : {gif: "", text: ""}

    }
  }

  componentDidMount() {
    // Runs after the first render() lifecycle

    const squares = [...this.state.squares];
    // Best practice to copy JSON objects.
    const pieces = JSON.parse(JSON.stringify(this.state.pieces));

    for (let i = 0; i < squares.length; i++){
      const square = squares[i];
      if (square !== null){
        const piece_name = square.piece_name;
        const piece_owner = square.player;
        const piece_style = square.style;
  
        const piece = {
          id: piece_name + piece_owner + i,
          name: piece_name,
          owner: piece_owner,
          style: piece_style,
          position_history: [i],
          kills: 0,
          alive: true,
          status: ""
        }
        
        if (piece_owner === 1){
          pieces.white.push(piece);
        } else {
          pieces.black.push(piece);
        }
      }
    }
    this.setState({pieces: pieces});


    const roomId = this.props.room;
    const username = this.props.username;
    this.socket = socketIOClient(SOCKET_SERVER_URL, {
      forceNew: true,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
      query: { roomId, username}
  });

  this.socket.on(PLAYER_LIST_EVENT, (playerList) => {
    console.log(playerList)
    let users = [];
    for (let player of playerList) {
      if (player.roomId === roomId) {
        users = [...users,player.username]
      }
    }
    this.setState({playerList : users});
  });


  this.socket.on(GAME_STATE_EVENT, (gameState) => {
    console.log("RECEIVING THIS FROM SERVER");
    console.log(gameState);
   
    if (gameState) {
      this.setState(gameState);
      console.log("game state updated")
    } else {
      console.log("gamestate was empty");
    }
  });

}

  setEventGif = (event) => {
    let gifUri = {gif: "", text: ""};

    switch(event) {
      case "victory":
        gifUri.gif = "https://media1.tenor.com/images/e0a515f0f996a3263394fa49cbcd99b1/tenor.gif?itemid=18538102";
        gifUri.text = "GAME OVER"
        break;
      case "flood":
        gifUri.gif = "https://media1.tenor.com/images/3d247ed5ee6dc382f4efadbca3581b58/tenor.gif?itemid=11927736";
        gifUri.text = "A great flood has cleansed the battlefield"
        break;
        
      case "killing":
        gifUri.gif = "https://media1.tenor.com/images/a0d13ec25f9774f155b6cd5ebf12a6c8/tenor.gif?itemid=18258403";
        gifUri.text = "He was kinda sus anyways.."
        break;

      case "resurrection":
        gifUri.gif = "https://media1.tenor.com/images/b6ac5ba4c30e2ce9a98b872167e4b2c2/tenor.gif?itemid=16213217";
        gifUri.text = "...and thus the dead shall rise again"
        break;
      
      case "plague":
        gifUri.gif = "https://media.giphy.com/media/djxrrxDSvEMen01uS5/giphy.gif"
        gifUri.text = "A deadly plague spreads through the battlefield"
        break;
    }

    this.setState({lastEventGif: gifUri});
  }

  update_server = (time) => {
    setTimeout(() => this.updateGameState(), time);
  }

  updateGameState = () => {
    let currentState = this.state;
    // currentState = this.addPieceNameToSquares(currentState);
    console.log("SENDING TO SERVER THIS");
    console.log(currentState);
    this.socket.emit(GAME_STATE_EVENT,currentState);
  };

  getPieceByInitialPosition = (initialPosition, tempPieces) => {
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    if (tempPieces){
      pieces = tempPieces;
    }
    let selectedPiece = null;
    Object.keys(pieces).forEach(colour => {
      for (const piece of pieces[colour]){
        if (piece.position_history[0] === initialPosition){
          selectedPiece = piece;
          break;
        }
      }
    });
    return selectedPiece;
  }

  getPieceById = (id, tempPieces) => {
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    if (tempPieces){
      pieces = tempPieces;
    }
    let selectedPiece = null;
    Object.keys(pieces).forEach(colour => {
      for (const piece of pieces[colour]){
        if (piece.id === id){
          selectedPiece = piece;
          break;
        }
      }
    });
    return selectedPiece;
  }

  getPiece = (position,tempPieces) => {
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    if (tempPieces){
      pieces = tempPieces;
    }
    let selectedPiece = null;
    Object.keys(pieces).forEach(colour => {
      for (const piece of pieces[colour]){
        if (piece.position_history[piece.position_history.length - 1] === position && piece.alive){
          selectedPiece = piece;
        }
      }
    });
    return selectedPiece;
  }

  killPieceAt = (position, piecesAndSquares) => {
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    let squares = [...this.state.squares];

    if (piecesAndSquares){
      pieces = piecesAndSquares.pieces;
      squares = piecesAndSquares.squares;
    }

    const piece = this.getPiece(position);
    if (piece !== null){
      if (piece.name !== null){
        piece.alive = false;
        squares[position] = null;
        pieces = this.updatePiecesObject(pieces,piece);
      } else {
        console.log("You almost committed suicide !!!");
      }
    }
    this.update_server(2000);

    this.setState({
      squares: squares,
      pieces: pieces
    });
    
    const return_obj = {
      squares: squares,
      pieces: pieces
    }
    return return_obj;
  }

  createPieceObject = (name,owner,kills) => {
    let newPiece = null;
    switch(name){
      case 'Rook':
        newPiece = new Rook(owner,kills);
        break;
      case 'Pawn':
        newPiece = new Pawn(owner,kills);
        break;
      case 'Bishop':
        newPiece = new Bishop(owner,kills);
        break;
      case 'King':
        newPiece = new King(owner,kills);
        break;
      case 'Queen':
        newPiece = new Queen(owner,kills);
        break;
      case 'Knight':
        newPiece = new Knight(owner,kills);
        break;
    }
    newPiece.piece_name = name;
    return newPiece
  }

  // If you give it only a position, it will resurect a piece that used to be there or nothing if incorrect index
  // If you give it a dead piece and a custom position.. it will spawn that piece there instead killing any piece on that spot
  resurrectPiece = (position, piece, piecesAndSquares) => {
    let newPiece = null;
    let currentPiece = null;
    if(piece){
      currentPiece = piece;
    } else if (!piecesAndSquares){
      currentPiece = this.getPieceByInitialPosition(position);
    } else {
      currentPiece = this.getPieceByInitialPosition(position, piecesAndSquares.pieces);
    }

    if (currentPiece !== null){
      newPiece = this.createPieceObject(currentPiece.name,currentPiece.owner,currentPiece.kills);
    }

    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    let squares = [...this.state.squares];

    if (piecesAndSquares){
      pieces = piecesAndSquares.pieces;
      squares = piecesAndSquares.squares;
    }

    if (currentPiece !== null && currentPiece.alive !== true){
      let occupyingPiece = null;
      if (squares[position] !== null){
        occupyingPiece = this.getPiece(position, pieces);
        piecesAndSquares = this.resurrectPiece(occupyingPiece.position_history[0], occupyingPiece, piecesAndSquares);
        pieces = this.updatePiecesObject(pieces, occupyingPiece);
      }
      squares[position] = newPiece;
      if (newPiece){
        squares[position].piece_name = newPiece.constructor.name;
      }
      currentPiece.alive = true;
      currentPiece.position_history = [position];
      pieces = this.updatePiecesObject(pieces, currentPiece);
    }

    this.update_server(2000);
    this.setState({squares: squares, pieces: pieces});

    const return_obj = {
      squares: squares,
      pieces: pieces
    }
    return return_obj;
  }

  checkKingIsAlive = (player, tempPieces) => {
    const whiteKingID = "King160";
    const blackKingID = "King24";

    let currentTempPieces = null;

    if (tempPieces){
      currentTempPieces = tempPieces;
    }

    let alive = false;
    if (player === 1){
      alive = this.getPieceById(whiteKingID, currentTempPieces).alive;
    } else {
      alive = this.getPieceById(blackKingID, currentTempPieces).alive;
    }
    return alive;
  };

  updatePiecesObject = (pieces, updated_piece) => {
    Object.keys(pieces).forEach(colour => {
      for (const piece of pieces[colour]){
        if (piece.id === updated_piece.id){
          pieces[colour][pieces[colour].indexOf(piece)] = updated_piece;      
        }
      }
    });
    return pieces;
  };

  switchPlayerTurn = () => {
    let currentPlayer = this.state.player;
    if (currentPlayer === 1){
      currentPlayer = 2;
    } else {
      currentPlayer = 1;
    }
    this.setState({player: currentPlayer});
  };

  canPlayerMove = () => {
    const currentPlayerTurn = this.state.player - 1;
    return this.props.username === this.state.playerList[currentPlayerTurn];
  };

  // All live pieces return to their initial position
  theFloodEffect = () => {
    let squares = [...this.state.squares];
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    
    Object.keys(pieces).forEach(colour => {
      for (let piece of pieces[colour]){
        // If piece is alive and was moved
        if (piece.alive && piece.position_history.length > 1){
          const currentPosition = piece.position_history[piece.position_history.length - 1];
          const originalPosition = piece.position_history[0];
          let piecesAndSquares = {pieces:pieces, squares:squares};
          piecesAndSquares = this.killPieceAt(currentPosition,piecesAndSquares);
          piecesAndSquares = this.resurrectPiece(originalPosition,null,piecesAndSquares);
            
          squares = piecesAndSquares.squares;
          pieces = piecesAndSquares.pieces;

        }
      }
    });
    this.update_server(2000);
    this.setState({squares: squares, pieces: pieces});
  };

  thePlagueEffect = (mortality) => {
    let squares = [...this.state.squares];
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));

    let squaresAndPieces = {
      squares: squares,
      pieces: pieces
    }

    for (let i = 0; i < squares.length; i++){
      const probability = Math.random()
      if (probability < mortality){
        const piece = this.getPiece(i);
        if (piece){
          if (piece.name !== "King"){
            squaresAndPieces = this.killPieceAt(i, squaresAndPieces);
          }
        }
      }
    }
    this.update_server(2000);
    this.setState({squares: squares, pieces: pieces});
    return squaresAndPieces;
  }

  // Give up to 1.. 1 is 0 and 0 is 100% chance
  chance_event = (chance, func, index) => {
    console.log(`Event triggered..${func} with a ${chance} of actually going through`);
    const probability = Math.random();
    let squares = [...this.state.squares];
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    let squaresAndPieces = {
      squares: squares,
      pieces: pieces,
      triggered: false,
    };

    if (probability < chance){
      console.log("EVENT TRIGGERED SUCCESSFULLY");
      switch (func) {
        case 'flood':
          this.theFloodEffect();
          squaresAndPieces.triggered = true;
          this.setEventGif("flood");
          console.log("Flood in effect.. everyone run!");
          break;
        case 'killPiece':
          squaresAndPieces = this.killPieceAt(index);
          squaresAndPieces.triggered = true;
          this.setEventGif("killing");
          console.log("Killed successfully");
          break;
        case 'revivePiece':
          squaresAndPieces = this.resurrectPiece(index);
          squaresAndPieces.triggered = true;
          this.setEventGif("resurrection");
          console.log("Revived successfully");
          break;
        case 'plague':
          const mortality = 0.3;
          squaresAndPieces = this.thePlagueEffect(mortality)
          squaresAndPieces.triggered = true;
          this.setEventGif("plague");
          console.log(`The plague hit with a mortality of ${mortality}`);
      }
    }
    return squaresAndPieces;
  }

  random_event = (index) => {
    const squares = [...this.state.squares];
    const pieces = JSON.parse(JSON.stringify(this.state.pieces));
    let squaresAndPieces = {
      squares: squares,
      pieces: pieces,
      triggered: false
    }
    if (this.getPiece(index) || this.getPieceByInitialPosition(index)){
      const probability = Math.random();
      const chance = Math.random();
      const events = ["flood", "killPiece", "revivePiece", "plague"];
      const eventIndex = Math.floor(Math.random() * 4);
      console.log("Probability has to be smaller than chance");
      console.log(`Chance .. ${chance}`);
      console.log(`Probability ..${probability}`);
      if (probability < chance){
        squaresAndPieces = this.chance_event(probability,events[eventIndex],index);
      }
    }
    return squaresAndPieces;
  }

  handleClick = (i) => {
    console.log(`Clicked at ${i}`);
    const random_event = this.random_event(i);
    if (!random_event.triggered){
      const currentPlayer = this.state.player;
      let squares = random_event.squares;
      let pieces = random_event.pieces;
      let gameOver = this.state.gameOver;
      let selectedPiece = this.getPiece(i);
      let sourceSelection = this.state.sourceSelection;
      let attacking = false;
      let moving = false;
  
      let previouslySelectedPiece = this.getPiece(sourceSelection);
  
      if (!gameOver){
        gameOver = !this.checkKingIsAlive(currentPlayer);
      }
  
      if (!gameOver){
         // Selecting new piece that isn't dead or non existant
        if (selectedPiece !== null){
          // If piece belongs to the player in turn and is still alive
          if (this.canPlayerMove() && currentPlayer === selectedPiece.owner){
            console.log("Valid piece selected...");
            console.log(selectedPiece);
            
            // If a piece was previously selected, de-select it...
            if (sourceSelection !== -1 && squares[sourceSelection]){
              squares[sourceSelection].style = { ...squares[sourceSelection].style, backgroundColor: "" };
            }
            
            sourceSelection = i; 
            if (squares[i]){
              squares[i].style = { ...squares[i].style, backgroundColor: "RGB(111,143,114)" };
            }
          } 
          // If piece belongs to enemy
          else {
            if (sourceSelection !== -1){
              attacking = true;
            } else {
              console.log("Click on your own damn pieces... unless...");
  
            }
          }
        } else {
          if (sourceSelection !== -1){
            moving = true;
          } else {
            console.log("Empty space clicked with no selection made...");
          }
        }
        
        if (previouslySelectedPiece){
          if (moving || attacking){
            squares[sourceSelection] = this.createPieceObject(previouslySelectedPiece.name, previouslySelectedPiece.owner, previouslySelectedPiece.kills);
            if (squares[sourceSelection]){
              const isMovePossible = squares[sourceSelection].isMovePossible(sourceSelection, i, Boolean(squares[i]));
              if (isMovePossible){
                console.log("A piece was properly selected.. so moving..");
                previouslySelectedPiece.position_history.push(i);
                if (attacking){
                  if (selectedPiece.name === 'King'){
                    this.setEventGif("victory");
                    gameOver = true;
                  }
                  selectedPiece.alive = false;
                  pieces = this.updatePiecesObject(pieces, selectedPiece);
                  previouslySelectedPiece.kills = previouslySelectedPiece.kills + 1;
                }
                pieces = this.updatePiecesObject(pieces, previouslySelectedPiece);
                console.log(previouslySelectedPiece);
                let piece_object = this.createPieceObject(previouslySelectedPiece.name, previouslySelectedPiece.owner, previouslySelectedPiece.kills);
                squares[i] = piece_object;
                squares[i].style = { ...squares[i].style, backgroundColor: "" };
                squares[sourceSelection] = null;
                sourceSelection = -1;
                this.switchPlayerTurn();
                this.update_server(1000);
              } else {
                console.log("Invalid move, deselected");
                squares[sourceSelection].style = { ...squares[sourceSelection].style, backgroundColor: "" };
                sourceSelection = -1;
              }
            } else {
              console.log("SOMETHING GOT BROKEN");
            }
            
            }
        }
        this.setState({
          squares: squares,
          sourceSelection: sourceSelection,
          pieces: pieces,
          gameOver: gameOver
        });
      }
      else {
        console.log("Game over.. stop clicking now...");
      }
    }
  }

  render() {

    console.log("can", this.props.username, "move?", this.canPlayerMove());

    const players = this.state.playerList.map((player, index) => {
      if (index === 0){
      return <p className="player-name-elements"><span>♜</span> {player}</p>
      } else if (index === 1) {
        return <p className="player-name-elements"><span>♖</span> {player}</p>
      } else {
        return <p className="player-name-elements">{player}</p>
      }
    })

    return (
      <>
      <div className="game-container">
        <div className="game">
          <div className="game-board">
            <Board
            className="board"
              squares={this.state.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <h3>Turn</h3>
            <div id="player-turn-box" style={{ backgroundColor: this.state.player === 1 ? "white" : "black" }}>

            </div>
            <div className="game-status">{this.state.status}</div>

            <div className="fallen-soldier-block">

              {<FallenSoldierBlock
                whiteFallenSoldiers={this.state.whiteFallenSoldiers}
                blackFallenSoldiers={this.state.blackFallenSoldiers}
              />
              }
            </div>

          </div>
        </div>

        <div className="players-container">
          <h3 className="players-header">Players in room</h3>
          {players}
        </div>
      </div>
        <div className="event-container">
            <h1 className="event-title">{this.state.lastEventGif.text}</h1>
            <img src={this.state.lastEventGif.gif} alt="" className="event-gif" />
        </div>
      </>
    );
  }
}