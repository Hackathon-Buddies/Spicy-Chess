import Piece from './piece.js';
import { isSameRow } from '../helpers'

const white_kill0 = "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg"
const white_kill1 = "https://www.imgurupload.com/uploads/20201115/6878283c6f5dab1f0634c4eb945761f48bec791e.png";
const white_kill2 = "https://www.imgurupload.com/uploads/20201115/cff3efcf8e831457c1b2ec760757a3921c2512db.png";
const white_kill3 = "https://www.imgurupload.com/uploads/20201115/fd7cbe9939b200801bb38869d3bf5885ce8a2786.png";
const white_kill4 = "https://www.imgurupload.com/uploads/20201115/2902ca4ef25ed8ca2e882edd1c6f05fb597fad5c.png";

const black_kill0 = "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg";
const black_kill1 = "https://www.imgurupload.com/uploads/20201115/8c1e88f5d02f43edb8fbe1c24b189201a1c72277.png";
const black_kill2 = "https://www.imgurupload.com/uploads/20201115/f060f307a02856d83666086142fb0f33cf09a591.png";
const black_kill3 = "https://www.imgurupload.com/uploads/20201115/4ddc3b0545e742241d8513f976791d7dd741f5a4.png";
const black_kill4 = "https://www.imgurupload.com/uploads/20201115/5c454014389fe49a1fc80957be9381a97f275289.png";

export default class Knight extends Piece {
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
    return ((src - 17 === dest && !isSameRow(src, dest)) ||
      (src - 10 === dest && !isSameRow(src, dest)) ||
      (src + 6 === dest && !isSameRow(src, dest)) ||
      (src + 15 === dest && !isSameRow(src, dest)) ||
      (src - 15 === dest && !isSameRow(src, dest)) ||
      (src - 6 === dest && !isSameRow(src, dest)) ||
      (src + 10 === dest && !isSameRow(src, dest)) ||
      (src + 17 === dest && !isSameRow(src, dest)))
  }

  /**
   * always returns empty array because of jumping
   * @return {[]}
   */
  getSrcToDestPath() {
    return [];
  }
}
