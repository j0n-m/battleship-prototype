import Ship from './ship';

const testShip = new Ship(3, 0, false);

test('Get methods are correct', () => {
  expect(testShip.getLength()).toBe(3);
  expect(testShip.getHitCount()).toBe(0);
});
test('hit() method works', () => {
  testShip.hit();
  testShip.hit();
  expect(testShip.hitCount).toBe(2);
});

test('isSunk() method works', () => {
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});
