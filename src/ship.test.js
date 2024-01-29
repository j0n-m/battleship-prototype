import Ship from './ship';

const testShip = new Ship(3, 1, false);

test('Get methods are correct', () => {
  expect(testShip.getLength()).toBe(3);
  expect(testShip.getHitCount()).toBe(1);
});
test('hit() method works', () => {
  testShip.hit();
  expect(testShip.hitCount).toBe(2);
});

test('isSunk() method works', () => {
  expect(testShip.isSunk()).toBe(false);
});
