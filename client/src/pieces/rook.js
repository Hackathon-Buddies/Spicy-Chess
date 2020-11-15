import Piece from './piece.js';
import { isSameRow, isSameColumn, isSameDiagonal, isPathClean } from '../helpers'

const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/b7acfab1bc3b1363f64cd247646156bbef915053.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/a50b7de1c9cb01949b8f5e76d8010ad463ee2027.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/6d0b89a174db2ee51a959034aa92e76b7b6f320f.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/aaa501085ff170dcb30b649b8529e0b5a1908c25.png";

const black_kill0 = "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg";
const black_kill1 = "https://www.imgurupload.com/uploads/20201115/d9713e50927383b8b252df9155f1502e4fb15100.png";
const black_kill2 = "https://www.imgurupload.com/uploads/20201115/1d9f2fe1a8c6b6adc3a192b52e768b7700920f60.png";
const black_kill3 = "https://www.imgurupload.com/uploads/20201115/8537ee21bd0053c5e8f30e32a5ca395ffa86122d.png";
const black_kill4 = "https://www.imgurupload.com/uploads/20201115/69daf2e177dc035736d87487b5bea7498dda645e.png";

export default class Rook extends Piece {
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
    return isPathClean(this.getSrcToDestPath(src, dest), squares) && (isSameColumn(src, dest) || isSameRow(src, dest));
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

