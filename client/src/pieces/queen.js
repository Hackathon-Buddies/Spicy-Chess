import Piece from './piece.js';
import { isSameRow, isSameColumn, isSameDiagonal, isPathClean } from '../helpers'

const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/9e777666266aa2f0ee374b8e00f0ee735eb2b213.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/9155877cd11fc6d280494f54f2d574434e9dec0d.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/dd653a536b730d40eff97c5db0dd01874c83442d.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/c7ba0a66fe1db7885cc32b6a3223c5ee9ce66207.png";

const black_kill0 = "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg";
const black_kill1 = "https://www.imgurupload.com/uploads/20201115/3447373a6f85cea3f8d0e095ca5f27680ce6b779.png";
const black_kill2 = "https://www.imgurupload.com/uploads/20201115/edf7caeb32ba3fb08fe39a349ad59b51d081b981.png";
const black_kill3 = "https://www.imgurupload.com/uploads/20201115/f4bd6badb78c2d9c09e55b90396c796411bb62be.png";
const black_kill4 = "https://www.imgurupload.com/uploads/20201115/a1df984c5d5f477f4f9d90925207be8e156da7c4.png";

export default class Queen extends Piece {
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
  }

  isMovePossible(src, dest, squares) {
    return isPathClean(this.getSrcToDestPath(src, dest), squares) && (isSameDiagonal(src, dest) || isSameRow(src, dest) || isSameColumn(src, dest));
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
    if (Math.abs(src - dest) % 8 === 0) {
      incrementBy = 8;
      pathStart += 8;
    }
    else if (Math.abs(src - dest) % 9 === 0) {
      incrementBy = 9;
      pathStart += 9;
    }
    else if (Math.abs(src - dest) % 7 === 0) {
      incrementBy = 7;
      pathStart += 7;
    }
    else {
      incrementBy = 1;
      pathStart += 1;
    }

    for (let i = pathStart; i < pathEnd; i += incrementBy) {
      path.push(i);
    }
    return path;
  }
}

