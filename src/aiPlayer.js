/* eslint-disable class-methods-use-this */
export default class AIPlayer {
  constructor(GameBoard) {
    this.name = 'Computer';
    this.gameBoard = GameBoard;
  }

  sendAttack(opponent, coords) {
    const status = opponent.gameBoard.receiveAttack(coords);
    if (status) {
      return { coords, status: true };
    }
    return { coords, status: false };
  }

  getName() {
    return this.name;
  }
}
