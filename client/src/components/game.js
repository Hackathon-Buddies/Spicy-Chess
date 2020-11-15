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
import useGameAllocation from '../helpers/useGameAllocation';
import socketIOClient from "socket.io-client";
import ENDPOINT from "../helpers/server-end-point";
import $ from 'jquery';
const GAME_STATE_EVENT = "gameState"; // Name of the event
// const SOCKET_SERVER_URL = ENDPOINT;
const SOCKET_SERVER_URL = "localhost:5000";


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
      playerRole: useGameAllocation(props.room)
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
        const piece_name = square.constructor.name;
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
    this.socket = socketIOClient(SOCKET_SERVER_URL, {
      forceNew: true,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
      query: { roomId}
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

  addPieceNameToSquares = (currentState) => {
    const squares = [...currentState.squares];

    for (let i = 0; i < squares.length; i++){
      console.log(squares[i]);
      
      if (squares[i] !== null){
        console.log(squares[i].constructor.name);
        squares[i]["piece_name"] = squares[i].constructor.name;
      }
    }

    currentState.squares = squares;
    return currentState;
  }

  updateGameState() {
    let currentState = this.state;

    if(!this.state.squares[0].piece_name){
      currentState = this.addPieceNameToSquares(currentState);
    }

    console.log("SENDING TO SERVER THIS");
    console.log(currentState);
    this.socket.emit(GAME_STATE_EVENT,currentState);
  }

  createKnightsTest(index) {
    const squares = [...this.state.squares];

    squares[index] = new Knight(2);
    for (let i=index+1; i < index+5; i++){
      squares[i] = new Knight(1);
    }
    this.setState({squares : squares});
  }


  getPieceByInitialPosition = (initialPosition) => {
    const pieces = JSON.parse(JSON.stringify(this.state.pieces));
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

  getPieceById = (id) => {
    const pieces = JSON.parse(JSON.stringify(this.state.pieces));
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

  getPiece = (position) => {
    const pieces = JSON.parse(JSON.stringify(this.state.pieces));
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

  killPieceAt = (position) => {
    const pieces = JSON.parse(JSON.stringify(this.state.pieces));
    const squares = [...this.state.squares];
    const piece = this.getPiece(position);
    let new_pieces = pieces;
    if (piece !== null){
      piece.alive = false;
      squares[position] = null;
      new_pieces = this.updatePiecesObject(pieces,piece);
    }
    this.setState({
      squares: squares,
      pieces: new_pieces
    });
  }

  createPieceObject(name, owner){
    let newPiece = null;
    switch(name){
      case 'Rook':
        newPiece = new Rook(owner);
        break;
      case 'Pawn':
        newPiece = new Pawn(owner);
        break;
      case 'Bishop':
        newPiece = new Bishop(owner);
        break;
      case 'King':
        newPiece = new King(owner);
        break;
      case 'Queen':
        newPiece = new Queen(owner);
        break;
      case 'Knight':
        newPiece = new Knight(owner);
        break;
    }
    return newPiece;
  }

  // If you give it only a position, it will resurect a piece that used to be there or nothing if incorrect index
  // If you give it a dead piece and a custom position.. it will spawn that piece there instead killing any piece on that spot
  resurrectPiece = (position, piece) => {
    let newPiece = null;
    let currentPiece = null;
    if(piece){
      currentPiece = piece;
    } else {
      currentPiece = this.getPieceByInitialPosition(position);
    }

    newPiece = this.createPieceObject(currentPiece.name,currentPiece.owner);

    const pieces = JSON.parse(JSON.stringify(this.state.pieces));
    const squares = [...this.state.squares];
    let new_pieces = pieces;
    if (currentPiece !== null && currentPiece.alive !== true){
      let occupyingPiece = null;
      if (squares[position] !== null){
        occupyingPiece = this.getPiece(position);
        occupyingPiece.alive = false;
        new_pieces = this.updatePiecesObject(pieces, occupyingPiece);
      }
      squares[position] = newPiece;
      currentPiece.alive = true;
      currentPiece.position_history = [position];
      new_pieces = this.updatePiecesObject(pieces, currentPiece);
    }
    this.setState({
      squares: squares,
      pieces: new_pieces
    }); 
  }

  checkKingIsAlive = (player) => {
    const whiteKingID = "King160";
    const blackKingID = "King24";
    let alive = false;
    if (player === 1){
      alive = this.getPieceById(whiteKingID).alive;
    } else {
      alive = this.getPieceById(blackKingID).alive;
    }
    return alive;
  }

  updatePiecesObject = (pieces, updated_piece) => {
    Object.keys(pieces).forEach(colour => {
      for (const piece of pieces[colour]){
        if (piece.id === updated_piece.id){
          pieces[colour][pieces[colour].indexOf(piece)] = updated_piece;      
        }
      }
    });
    return pieces;
  }

  switchPlayerTurn = () => {
    let currentPlayer = this.state.player;
    if (currentPlayer === 1){
      currentPlayer = 2;
    } else {
      currentPlayer = 1;
    }
    this.setState({player: currentPlayer});
  }

  handleClick(i) {
    console.log(`Clicked at ${i}`);
    const squares = [...this.state.squares];
    const currentPlayer = this.state.player;
    let pieces = JSON.parse(JSON.stringify(this.state.pieces));
    let gameOver = this.state.gameOver;
    let selectedPiece = this.getPiece(i);
    let sourceSelection = this.state.sourceSelection;
    let attacking = false;
    let moving = false;

    gameOver = !this.checkKingIsAlive(currentPlayer);

    if (!gameOver){
       // Selecting new piece
      if (selectedPiece !== null){
        // If piece belongs to the player in turn
        if (selectedPiece.owner === currentPlayer){
          console.log("Valid piece selected...");
          console.log(selectedPiece);
          
          // If a piece was previously selected, de-select it...
          if (sourceSelection !== -1){
            squares[sourceSelection].style = { ...squares[sourceSelection].style, backgroundColor: "" };
          }
          sourceSelection = i; 
          squares[i].style = { ...squares[i].style, backgroundColor: "RGB(111,143,114)" }; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html
        } 
        // If piece belongs to enemy
        else {
          if (sourceSelection !== -1){
            attacking = true;
          } else {
            console.log("Click on your own damn pieces...");
          }
        }
      } else {
        if (sourceSelection !== -1){
          moving = true;
        } else {
          console.log("Empty space clicked with no selection made...");
        }
      }
  
      if (moving || attacking){
        if (squares[sourceSelection].piece_name){
          squares[sourceSelection] = this.createPieceObject(squares[sourceSelection].piece_name,squares[sourceSelection].player);
        }
        else {
          if (squares[sourceSelection]){
            const isMovePossible = squares[sourceSelection].isMovePossible(sourceSelection, i, Boolean(squares[i]));
            if (isMovePossible){
              console.log("A piece was properly selected.. so moving..");
              let previouslySelectedPiece = this.getPiece(sourceSelection);
              previouslySelectedPiece.position_history.push(i);
              if (attacking){
                if (selectedPiece.name === 'King'){
                  gameOver = true;
                }
                selectedPiece.alive = false;
                pieces = this.updatePiecesObject(pieces, selectedPiece);
                previouslySelectedPiece.kills = previouslySelectedPiece.kills + 1;
              }
              pieces = this.updatePiecesObject(pieces, previouslySelectedPiece);
              console.log(previouslySelectedPiece);
              squares[i] = squares[sourceSelection];
              squares[i].piece_name = this.getPiece(sourceSelection).name;
              console.log("Name of square at this point");
              console.log(squares[i].piece_name);
              squares[i].style = { ...squares[i].style, backgroundColor: "" };
              squares[sourceSelection] = null;
              sourceSelection = -1;
              this.switchPlayerTurn();
              // this.updateGameState();
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
      })
    }
    else {
      console.log("Game over.. stop clicking now...");
    }
  }

  render() {

    return (
      <div>
        <p>
          My role is: {this.state.playerRole}
        </p>
        <div className="game">
          <div className="game-board">
            <Board
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
        {/* Test buttons */}
        <button onClick={() => this.createKnightsTest(25)}>add knights1</button>
        <button onClick={() => this.killPieceAt(0)}>Kill at 0</button>
        <button onClick={() => this.resurrectPiece(0)}>Ressurect at 0</button>
        <button onClick={() => this.updateGameState()}>End Turn</button>
        <div className="icons-attribution">
          <div> <small> Chess Icons And Favicon (extracted) By en:User:Cburnett [<a href="http://www.gnu.org/copyleft/fdl.html">GFDL</a>, <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA-3.0</a>, <a href="http://opensource.org/licenses/bsd-license.php">BSD</a> or <a href="http://www.gnu.org/licenses/gpl.html">GPL</a>], <a href="https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces">via Wikimedia Commons</a> </small></div>
        </div>
        <ul>
          <li><a href="https://github.com/TalhaAwan/react-chess" target="_blank">Source Code</a> </li>
          <li><a href="https://www.techighness.com/post/develop-two-player-chess-game-with-react-js/">Blog Post</a></li>
        </ul>
      </div>


    );
  }
}

