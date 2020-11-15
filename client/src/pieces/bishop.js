import Piece from './piece.js';
import { isSameDiagonal, isPathClean } from '../helpers'


const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg";
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/1f14874dc1c2d6ab35ff3177579c5da9f2f91423.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/d071735b8456e293267d0b91bee160918426f8d3.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/e685d90b0e2d0336e760ad5c0cec1a42fc8b1db6.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/6ab705d5c61f572db1e54cc42cf4b76e3e848c12.png";

export default class Bishop extends Piece {
  constructor(player,kills) {
    let white_image = white_kill0;
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
    }
    
    super(player, (player === 1 ? white_image : "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"));
  }

  isMovePossible(src, dest, squares) {
    return isPathClean(this.getSrcToDestPath(src, dest), squares) && isSameDiagonal(src, dest)
  }

  /**
   * get path between src and dest (src and dest exclusive)
   * @param  {num} src  
   * @param  {num} dest 
   * @return {[array]}      
   */
  getSrcToDestPath(src, dest) {
    let path = [], pathStart, pathEnd, incrementBy;
    if (src > dest) {
      pathStart = dest;
      pathEnd = src;
    }
    else {
      pathStart = src;
      pathEnd = dest;
    }
    if (Math.abs(src - dest) % 9 === 0) {
      incrementBy = 9;
      pathStart += 9;
    }
    else {
      incrementBy = 7;
      pathStart += 7;
    }

    for (let i = pathStart; i < pathEnd; i += incrementBy) {
      path.push(i);
    }
    return path;
  }
}
