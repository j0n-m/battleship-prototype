/* eslint-disable class-methods-use-this */
export default class Player {
  constructor(name, GameBoard) {
    this.name = name;
    this.gameBoard = GameBoard;
  }

  sendAttack(opponent, coords) {
    const response = opponent.gameBoard.receiveAttack(coords);
    if (response) {
      return { coords, status: true };
    }
    return { coords, status: false };
  }

  getName() {
    return this.name;
  }

  setName(newName) {
    this.name = newName;
  }
}
