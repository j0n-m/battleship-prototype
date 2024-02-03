/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
import { getAIShipPlacements, isSurrounded, player2 } from './gameController';
import Ship from './ship';

// this test doesn't matter, its designed to fail, just needed to see the return array values
// test('testing', () => {
//   const arr = getAIShipPlacements();
//   expect(arr).toBe(100);
// });

// export function isSurrounded(gameboard, coords, anchorLetter) {
test('testing', () => {
  const gb = [
    [null, new Ship(3), new Ship(3), new Ship(3), null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];
  let value = isSurrounded(gb, [1, 3], 'x');
  // const value = true;
  expect(value).toBe(true);
  value = isSurrounded(gb, [0, 1], 'y');
  expect(value).toBe(true);
});
