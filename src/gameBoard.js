export default class GameBoard {
  constructor() {
    this.missedHits = []; // values are arrays of coords : [x,y]
    this.allShipsSunk = false;
    this.board = this.createBoard();
    this.totalShipHits = 0;
  }

  createBoard() {
    const size = 10;
    const board = [];
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i][j] = null;
      }
    }
    return board;
  }

  placeShip(coords, Ship) {
    // place ships at specific coordinates by calling the ship factory function
    const [x, y] = coords;
    // check if isVertical on ship?

    // places ship at coords
    this.board[x][y] = Ship;
  }

  receiveAttack(coords) {
    // eslint-disable-next-line max-len
    // determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
    const [x, y] = coords;
    const ship = this.board[x][y];
    if (ship == null) {
      this.missedHits.push(coords);
      return;
    }
    ship.hit();
    this.totalShipHits += 1;
  }

  // isAllShipsSunk() {
  //   // get total length of  all ships and if equal or greater than this.totalHits
  //   // then return true
  // }
}
