import GameBoard from './gameBoard';
import Ship from './ship';

const testShip = new Ship();
const testGameBoard = new GameBoard();

test('Create 10x10 gameboard with 100 null values', () => {
  let count = 0;
  for (const row of testGameBoard.board) {
    for (const column of row) {
      expect(column).toBeNull();
      count++;
    }
  }
  expect(count).toBe(100);
});

test('Place ship at right coords', () => {
  testGameBoard.placeShip([1, 1], testShip);
  expect(testGameBoard.board[1][1]).toBeInstanceOf(Ship);
});
test('Attempt to hit Ship but miss', () => {
  testGameBoard.receiveAttack([5, 5], testShip);
  expect(testGameBoard.missedHits).toContainEqual([5, 5]);
});
test('Attempt to hit Ship and is a hit', () => {
  testGameBoard.receiveAttack([1, 1], testShip);
  expect(testShip.getHitCount()).toBe(1);
});
