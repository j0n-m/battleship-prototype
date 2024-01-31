export default class AIPlayer {
  constructor(GameBoard) {
    this.name = 'Computer';
    this.gameBoard = GameBoard;
  }

  sendAttack(PlayerObj) {
    const coords = this.gameBoard.generateCoords();
    const status = PlayerObj.gameBoard.recieveAttack(coords);
    if (status) {
      return coords;
    }
    return status;
  }
}
