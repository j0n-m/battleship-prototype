export default class Ship {
  constructor(length, hitCount = 0) {
    this.length = length;
    this.hitCount = hitCount;
  }

  getLength() {
    return this.length;
  }

  getHitCount() {
    return this.hitCount;
  }

  isSunk() {
    return (this.hitCount >= this.length);
  }

  hit() {
    this.hitCount += 1;
  }
}
