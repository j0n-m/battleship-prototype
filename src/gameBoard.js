/* eslint-disable no-plusplus */
export default class GameBoard {
  constructor() {
    this.missedHits = []; // values are arrays of coords : [x,y]
    this.board = this.createBoard();
    this.totalShipHits = 0;
    this.totalShipsLength = 0;
  }

  // eslint-disable-next-line class-methods-use-this
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
    this.totalShipsLength += 1;// temp variable, assuming each Ship occupying one coordinate is of length 1;
    // this.totalShipsLength += Ship.getLength();
  }

  receiveAttack(coords) {
    // eslint-disable-next-line max-len
    // determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
    const [x, y] = coords;
    const ship = this.board[x][y];
    if (ship == null) {
      this.missedHits.push(coords);
      return false;
    }
    ship.hit();
    this.totalShipHits += 1;
    return true;
  }

  isAllShipsSunk() {
    if (this.totalShipHits >= this.totalShipsLength) {
      return true;
    }
    return false;
  }

  // AI methods
  // eslint-disable-next-line class-methods-use-this
  generateCoords() {
    const x = Math.random() * 10; // bound to game board size of 10
    const y = Math.random() * 10;
    return [x, y];
  }
}
