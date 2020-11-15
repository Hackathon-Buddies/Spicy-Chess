import Piece from './piece.js';
import { isSameDiagonal } from '../helpers'

const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/e022d2e44e4ab15c51a8291ea13be0babc124f81.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/80b8888a6d559d6ae4029cc3fbaa3d2d9c76a7f4.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/4876427030bb7bcfa7993af8db2655cfe68e1a5e.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/17df58f8e4fe91b51a511503a4f7dc963e3cf7e0.png";

const black_kill0 = "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg";
const black_kill1 = "https://www.imgurupload.com/uploads/20201115/21fa02677771996833ec9c1c9f0f9804961a9ded.png";
const black_kill2 = "https://www.imgurupload.com/uploads/20201115/7b9fa2f28f4152cdd42a618e2e2de1ef9617db4d.png";
const black_kill3 = "https://www.imgurupload.com/uploads/20201115/6125407ee12e83effac6a65e8ef4b5f848de1a7c.png";
const black_kill4 = "https://www.imgurupload.com/uploads/20201115/883e94f1b322fb105fb2a9833c2d00400559f9c1.png";

export default class Pawn extends Piece {
  constructor(player,kills) {
    let white_image = white_kill0;
    let black_image = black_kill0;
    if (player === 1){
      if(kills){
        switch(kills){
          case 0:
            white_image = white_kill0;
            break;
          case 1:
            white_image = white_kill1;
            break;
          case 2:
            white_image = white_kill2;
            break;
          case 3:
            white_image = white_kill3;
            break;
          default:
            white_image = white_kill4;
            break;
        }
      }
      else {
        white_image = white_kill0;
      }
    } else {
      if(kills){
        switch(kills){
          case 0:
            black_image = black_kill0;
            break;
          case 1:
            black_image = black_kill1;
            break;
          case 2:
            black_image = black_kill2;
            break;
          case 3:
            black_image = black_kill3;
            break;
          default:
            black_image = black_kill4;
            break;
        }
      }
    }
    super(player, (player === 1 ? white_image : black_image));
    this.initialPositions = {
      1: [48, 49, 50, 51, 52, 53, 54, 55],
      2: [8, 9, 10, 11, 12, 13, 14, 15]
    }
  }

  isMovePossible(src, dest, isDestEnemyOccupied) {

    if (this.player === 1) {
      if ((dest === src - 8 && !isDestEnemyOccupied) || (dest === src - 16 && !isDestEnemyOccupied && this.initialPositions[1].indexOf(src) !== -1)) {
        return true;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src - 9 || dest === src - 7)) {
        return true;
      }
    }
    else if (this.player === 2) {
      if ((dest === src + 8 && !isDestEnemyOccupied) || (dest === src + 16 && !isDestEnemyOccupied && this.initialPositions[2].indexOf(src) !== -1)) {
        return true;
      }
      else if (isDestEnemyOccupied && isSameDiagonal(src, dest) && (dest === src + 9 || dest === src + 7)) {
        return true;
      }
    }
    return false;
  }

  /**
   * returns array of one if pawn moves two steps, else returns empty array  
   * @param  {[type]} src  [description]
   * @param  {[type]} dest [description]
   * @return {[type]}      [description]
   */
  getSrcToDestPath(src, dest) {
    if (dest === src - 16) {
      return [src - 8];
    }
    else if (dest === src + 16) {
      return [src + 8];
    }
    return [];
  }
}
