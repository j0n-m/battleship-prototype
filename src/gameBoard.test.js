/* eslint-disable max-len */
/* eslint-disable no-undef */
import GameBoard from './gameBoard';
import Ship from './ship';

const testShip = new Ship(3);
const testGameBoard = new GameBoard();

test('Create 10x10 gameboard with 100 null values', () => {
  const count = (testGameBoard.board.length * testGameBoard.board[0].length); // row length * column length
  expect(count).toBe(100);
  expect(testGameBoard.board[9][9]).toBeNull(); // last location on 10x10 board to check if it exists and is null
});

test('Place ship at right coords', () => {
  testGameBoard.placeShip([1, 1], testShip);
  testGameBoard.placeShip([2, 2], testShip);
  expect(testGameBoard.board[1][1]).toBeInstanceOf(Ship);
  expect(testGameBoard.board[2][2]).toBeInstanceOf(Ship);
});
test('Attempt to hit Ship but miss', () => {
  testGameBoard.receiveAttack([5, 5], testShip);
  testGameBoard.receiveAttack([7, 7], testShip);
  expect(testGameBoard.missedHits).toContainEqual([5, 5]);
  expect(testGameBoard.missedHits).toContainEqual([7, 7]);
});

test('update totalShipsLength property', () => {
  expect(testGameBoard.totalShipsLength).toBe(6); // previously placed ships of length 3 twice
});
test('Attempt to hit Ship and is a hit', () => {
  testGameBoard.receiveAttack([1, 1], testShip);
  testGameBoard.receiveAttack([2, 2], testShip);
  expect(testShip.getHitCount()).toBe(2);
});
test('update totalShipHits property', () => {
  expect(testGameBoard.totalShipHits).toBe(2); // after 2 successful hits, it updates += 2
});
test('isAllShipsSunk() function works', () => {
  expect(testGameBoard.isAllShipsSunk()).toBe(false);
});
