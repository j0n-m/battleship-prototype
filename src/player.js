/* eslint-disable class-methods-use-this */
export default class Player {
  constructor(name, GameBoard) {
    this.name = name;
    this.gameBoard = GameBoard;
  }

  sendAttack(coords, PlayerObj) {
    const status = PlayerObj.gameBoard.recieveAttack(coords);
    if (status) {
      return coords;
    }
    return status;
  }
}
