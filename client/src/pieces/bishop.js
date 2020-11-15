import Piece from './piece.js';
import { isSameDiagonal, isPathClean } from '../helpers'


const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg";
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/1f14874dc1c2d6ab35ff3177579c5da9f2f91423.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/d071735b8456e293267d0b91bee160918426f8d3.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/e685d90b0e2d0336e760ad5c0cec1a42fc8b1db6.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/6ab705d5c61f572db1e54cc42cf4b76e3e848c12.png";

const black_kill0 = "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg";
const black_kill1 = "https://www.imgurupload.com/uploads/20201115/b8a88d11051b60bd51fbfa4a539bcbf1cbeaf43b.png";
const black_kill2 = "https://www.imgurupload.com/uploads/20201115/8699bb174262b2059fde2c9e9819626282b68f18.png";
const black_kill3 = "https://www.imgurupload.com/uploads/20201115/1022c9d9cd88cda1aa7b5a6e89d955cdc93a9a94.png";
const black_kill4 = "https://www.imgurupload.com/uploads/20201115/dad91de73865834fe7652b68e085ee278b112b61.png";

export default class Bishop extends Piece {
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
    
    super(player, (player === 1 ? white_image : black_image ));
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
