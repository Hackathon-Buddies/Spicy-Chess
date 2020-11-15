import Piece from './piece.js';
import { isSameDiagonal, isSameRow } from '../helpers'

const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/6b7b87bf328fa5b82927b448e9a147063620c38e.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/31f014cf5fae32231562f65292b6b64b8cde328b.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/371e1f33c9dece9b3bd22a0e625328867f4786f6.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/65f4c8637ddeeadbf9f67c90bb646bd172ad7281.png";

const black_kill0 = "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg";
const black_kill1 = "https://www.imgurupload.com/uploads/20201115/b4e317d1e7734bf107b61ff5f2c90626dcd67cd4.png";
const black_kill2 = "https://www.imgurupload.com/uploads/20201115/895bfed9745f15356b102599bc9d47eacdfe1682.png";
const black_kill3 = "https://www.imgurupload.com/uploads/20201115/4d2549e482dd3243bb1cebb5c821bf978393ab3c.png";
const black_kill4 = "https://www.imgurupload.com/uploads/20201115/2fd59089c5d4f75902630bb6ba0d4d3bc3e8cb41.png";

export default class King extends Piece {
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

  isMovePossible(src, dest) {
    return ((src - 9 === dest && isSameDiagonal(src, dest)) ||
      src - 8 === dest ||
      (src - 7 === dest && isSameDiagonal(src, dest)) ||
      (src + 1 === dest && isSameRow(src, dest)) ||
      (src + 9 === dest && isSameDiagonal(src, dest)) ||
      src + 8 === dest ||
      (src + 7 === dest && isSameDiagonal(src, dest)) ||
      (src - 1 === dest && isSameRow(src, dest)))
  }

  /**
   * always returns empty array because of one step
   * @return {[]}
   */
  getSrcToDestPath(src, dest) {
    return [];
  }
}
