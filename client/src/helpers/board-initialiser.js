import Bishop from '../pieces/bishop.js';
import King from '../pieces/king.js';
import Knight from '../pieces/knight.js';
import Pawn from '../pieces/pawn.js';
import Queen from '../pieces/queen.js';
import Rook from '../pieces/rook.js';

export default function initialiseChessBoard() {
  const squares = Array(64).fill(null);

  for (let i = 8; i < 16; i++) {
    squares[i] = new Pawn(2);
    squares[i].piece_name = "Pawn";
    squares[i + 40] = new Pawn(1);
    squares[i + 40].piece_name = "Pawn";
  }

  squares[0] = new Rook(2,0);
  squares[0].piece_name = "Rook";
  squares[7] = new Rook(2,0);
  squares[7].piece_name = "Rook";
  squares[56] = new Rook(1,0);
  squares[56].piece_name = "Rook";
  squares[63] = new Rook(1,0);
  squares[63].piece_name = "Rook";

  squares[1] = new Knight(2,0);
  squares[1].piece_name = "Knight";
  squares[6] = new Knight(2,0);
  squares[6].piece_name = "Knight";
  squares[57] = new Knight(1,0);
  squares[57].piece_name = "Knight";
  squares[62] = new Knight(1,0);
  squares[62].piece_name = "Knight";

  squares[2] = new Bishop(2,0);
  squares[2].piece_name = "Bishop";
  squares[5] = new Bishop(2,0);
  squares[5].piece_name = "Bishop";
  squares[58] = new Bishop(1,0);
  squares[58].piece_name = "Bishop";
  squares[61] = new Bishop(1,0);
  squares[61].piece_name = "Bishop";

  squares[3] = new Queen(2,0);
  squares[3].piece_name = "Queen";
  squares[4] = new King(2,0);
  squares[4].piece_name = "King";

  squares[59] = new Queen(1,0);
  squares[59].piece_name = "Queen";

  squares[60] = new King(1,0);
  squares[60].piece_name = "King";
  return squares;
}