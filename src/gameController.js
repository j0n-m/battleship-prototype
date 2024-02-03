/* eslint-disable no-use-before-define */
/* eslint-disable radix */
/* eslint-disable max-len */
import Ship from './ship';
import GameBoard from './gameBoard';
import Player from './player';
import AIPlayer from './aiPlayer';
import pubSub from './pubSub';

console.log('gameController initialized');
// create gameboard
const gameBoard1 = new GameBoard();
const gameBoard2 = new GameBoard();

// create player with default values (can change player name with function)
export const player1 = new Player('Player 1', gameBoard1);
export const player2 = new AIPlayer(gameBoard2);
export const player1PlacedShips = [];
export const player2PlacedShips = [];

// player turns
const playerQueue = [];

playerQueue.push(player1, player2);

let playerTurn = playerQueue.shift();

// create 3 ships for each player
// const p1Ships = [new Ship(3), new Ship(3), new Ship(4)];
// const p2Ships = [new Ship(3), new Ship(3), new Ship(4)];
// export const testP1Ships = [new Ship(3)];
export const p1Ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];
export const p2Ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];

// TEMP - pre-determined coords for ship placement
// const p1ShipCoords = [[1, 1], [2, 1], [3, 1], [2, 3], [2, 4], [2, 5], [9, 0], [9, 1], [9, 2], [9, 3]];
// const p2ShipCoords = [[5, 0], [5, 1], [5, 2], [7, 0], [7, 1], [7, 2], [6, 5], [7, 5], [8, 5], [9, 5]];
setAIShipPlacements();
// console.log('AI board:', player2.gameBoard.board);
// p2Ships.forEach((ship) => {
//   for (let i = 0; i < ship.getLength(); i++) {
//     if (p2ShipCoords.length === 0) {
//       console.log('p2ShipCoords is empty, returning');
//       return;
//     }
//     player2.gameBoard.placeShip(p2ShipCoords.shift(), ship);
//   }
// });
// const currentP2Ship = player2PlacedShips.shift();
// p2ShipCoords.forEach((shipCoords) => {
//   player2.gameBoard.placeShip(shipCoords, currentP2Ship);
// });
// console.log('checking opponents ships [hits to shipLength]:', getOppenent().gameBoard.totalShipHits, getOppenent().gameBoard.totalShipsLength);

// After import initializing test:
// console.log('placed ships, example P1 @ [1,1]', player1.gameBoard.board[1][1]);

//* ************************[Game Functions]***********************************//
export const getPlayerTurn = () => playerTurn;
export function getOppenent() {
  return playerQueue[0];
}
export const setPlayerName = (player, newName) => {
  player.setName(newName);
  pubSub.publish('playerNameChanged');
};
export const switchPlayerTurn = () => {
  playerQueue.push(playerTurn);
  playerTurn = playerQueue.shift();
  pubSub.publish('switchTurns');
};
export async function sleep(delay) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, delay));
}
export const getPlayer1CurrentShipLength = () => {
  if (p1Ships[0]) {
    return p1Ships[0].getLength();
  }
  return 0;
};
export function getPlayer2CurrentShipLength() {
  if (p2Ships[0]) {
    return p2Ships[0].getLength();
  }
  return 0;
}
export function isSurrounded(gameboard, coords, anchorLetter, firstCoords = false, lastCoords = false) {
  // console.log(firstCoords, lastCoords);
  const [x, y] = coords;
  const moveset = (anchorLetter === 'x') ? [[x + 1, y], [x - 1, y]] : [[x, y + 1], [x, y - 1]];
  if (firstCoords && anchorLetter === 'x') {
    moveset.push([x, y - 1]);
  } else if (lastCoords && anchorLetter === 'x') {
    moveset.push([x, y + 1]);
  }
  if (firstCoords && anchorLetter === 'y') {
    moveset.push([x - 1, y]);
  } else if (lastCoords && anchorLetter === 'y') {
    moveset.push([x + 1, y]);
  }
  // console.log('moveset', moveset);
  const filterd = moveset.filter((movesetCoord) => {
    const [newX, newY] = movesetCoord;
    return isWithinBoard(newX, newY);
  });
  return filterd.some((coordinates) => {
    const [iX, iY] = coordinates;
    // console.log(`checking if ${iX}, ${iY} is instance of Ship`, gameboard[iX][iY] instanceof Ship);
    return (gameboard[iX][iY] instanceof Ship);
  });
}
export function setAIShipPlacements() {
  // get 1 random coord
  const placementHistory = [];
  let randomCoord = getRandomCoords();
  while (isDuplicateMoveOnAIBoard(placementHistory, getRandomCoords())) {
    randomCoord = getRandomCoords();
  }
  // random 1 or 2 to decide if verticle or horizontal
  // const coordinateSet = [];
  while (getPlayer2CurrentShipLength()) {
    let coordinateHistory = [];
    const [xCoord, yCoord] = randomCoord;
    const randomCoinFlip = parseInt(Math.random() * 2); // returns 0 or 1
    const isHorizontal = (randomCoinFlip === 1);
    const anchorLetter = (isHorizontal) ? 'x' : 'y';
    const anchorNum = (isHorizontal) ? Number(xCoord) : Number(yCoord);
    // const oppositeLetter = (anchorLetter === 'x') ? 'y' : 'x';
    let oppositeNum = (isHorizontal) ? Number(yCoord) : Number(xCoord);
    for (let i = 0; i < getPlayer2CurrentShipLength(); i++) {
      // checks if within board and not duplicatemove
      let firstCoords = false;
      let lastCoords = false;
      firstCoords = (i === 0);
      lastCoords = (i === getPlayer2CurrentShipLength() - 1);
      const newCoord = (anchorLetter === 'x') ? [anchorNum, oppositeNum] : [oppositeNum, anchorNum];
      const [newX, newY] = newCoord;
      if (isWithinBoard(newX, newY) && !isDuplicateMoveOnAIBoard(placementHistory, newCoord) && !isSurrounded(player2.gameBoard.board, newCoord, anchorLetter, firstCoords, lastCoords)) {
        coordinateHistory.push(newCoord);
        placementHistory.push(newCoord);
        oppositeNum++;
      }
    }
    if (coordinateHistory.length !== getPlayer2CurrentShipLength()) {
      // start over
      coordinateHistory = [];
      randomCoord = getRandomCoords();
    } else {
      // coordinateSet.push(...coordinateHistory);
      const currentShip = p2Ships.shift();
      coordinateHistory.forEach((shipCoords) => {
        player2.gameBoard.placeShip(shipCoords, currentShip);
      });
      player2PlacedShips.push(currentShip);
      coordinateHistory = [];
      randomCoord = getRandomCoords();
    }
  }
}
const mapIndexToPlayer = (coords) => {
  const [x, y] = coords;
  const mapX = new Map();
  mapX.set(0, 'A');
  mapX.set(1, 'B');
  mapX.set(2, 'C');
  mapX.set(3, 'D');
  mapX.set(4, 'E');
  mapX.set(5, 'F');
  mapX.set(6, 'G');
  mapX.set(7, 'H');
  mapX.set(8, 'I');
  mapX.set(9, 'J');

  return `[${mapX.get(x)}${y + 1}]`;
};
const gameEnd = () => {
  console.log(`~~~~~~~GAME OVER, ${getPlayerTurn().getName()} WINS ~~~~~~~`);
  pubSub.publish('gameWin');
};
function setAINextMoves(x, y) {
  const moveset = [
    [x - 1, y], [x, y + 1], [x + 1, y], [x, y - 1],
  ];
  const possibleMoveset = moveset.filter((arr) => {
    const [arrX, arrY] = arr;
    return (isWithinBoard(arrX, arrY) && !isDuplicateMove(arr));
  });
  while (possibleMoveset.length !== 0) {
    const move = possibleMoveset.shift();
    console.log(`adding ${move} to ${getPlayerTurn().getName()}'s next moves`);
    getPlayerTurn().gameBoard.nextMoves.push(move);
  }
}
function isDuplicateMove(coords) {
  // searches opponents board for history of attacks
  const boardHistory = getOppenent().gameBoard.history;
  const [origX, origY] = coords;
  // origX = Number(origX);
  // origY = Number(origY);
  return boardHistory.find((attackedCoords) => {
    const [eX, eY] = attackedCoords;
    return (eX === origX && eY === origY);
  });
}
function isDuplicateMoveOnAIBoard(arrSet, coords) {
  // searches opponents board for history of attacks
  const [origX, origY] = coords;
  // origX = Number(origX);
  // origY = Number(origY);
  return arrSet.find((attackedCoords) => {
    const [eX, eY] = attackedCoords;
    return (eX === origX && eY === origY);
  });
}
export function isAHit(aiX, aiY) { // AI function
  // AI needs to pre-check if there was a ship at coords in player1's board
  if (player1.gameBoard.board[aiX][aiY] instanceof Ship) {
    return true;
  }
  return false;
}
export function isAHitP(aiX, aiY, player) { // AI function
  // AI needs to pre-check if there was a ship at coords in player1's board
  if (player.gameBoard.board[aiX][aiY] instanceof Ship) {
    return true;
  }
  return false;
}
export function isWithinBoard(x, y) {
  if (x >= 0 && x <= 9 && y >= 0 && y <= 9) {
    return true;
  }
  return false;
}
export const isDuplicateMissCoords = (coords) => {
  const [origX, origY] = coords;
  const opponent = getOppenent();
  const opponentMissBoard = opponent.gameBoard.missedHits;
  return opponentMissBoard.find((arr) => {
    const [x, y] = arr;
    return (x === origX && y === origY);
  });
};
export function getRandomCoords() {
  const x = parseInt(Math.random() * 10); // bound to game board size of 10
  const y = parseInt(Math.random() * 10);
  return [x, y];
}
function getAINextHit() {
  // let generatedCoords = getRandomCoords();
  let randomCoords = getRandomCoords();
  const aiNextMovesArr = getPlayerTurn().gameBoard.nextMoves;

  if (aiNextMovesArr.length) {
    // reassigns randomCoords to use nextMoves set
    randomCoords = aiNextMovesArr.shift();
  }
  // check if random coords are fresh, unused coords;
  while (isDuplicateMove(randomCoords)) {
    // reassigns randomCoords if its a duplicate attack;
    randomCoords = getRandomCoords();
  }
  // the random coords are fresh
  // AI LOGIC BELOW
  const [x, y] = randomCoords;
  if (isAHit(x, y)) {
    // if coords hit a ship, return that coord and add surrounding coords to next moves array
    setAINextMoves(x, y); // adds surround non duplicated coords to next moves array
    return randomCoords;
  }

  return randomCoords;
}
export const playRound = async (coords) => {
  // attack opponent
  const player = getPlayerTurn();
  const opponent = getOppenent();
  if (isDuplicateMissCoords(coords)) {
    console.log('No duplicate coords');
    return;
  }
  const response = player.sendAttack(opponent, coords);
  // process response data after attack
  const mappedCoords = mapIndexToPlayer(response.coords);
  let consoleMessage = (!response.status) ? `${player.getName()} MISS at ${mappedCoords}` : `${player.getName()} HIT at ${mappedCoords}`;
  console.log(consoleMessage);
  if (getOppenent().gameBoard.board[coords[0]][coords[1]]) {
    consoleMessage = (getOppenent().gameBoard.board[coords[0]][coords[1]].isSunk()) ? `You HIT the Ship at ${mappedCoords} and it Sunk!` : consoleMessage;
    console.log('You sunk the ship!');
  }
  pubSub.publish('newConsoleMessage', consoleMessage);
  pubSub.publish('renderBoardSquare', response);
  // check if all ships down
  // console.log('checking opponents ships [hits to shipLength]:', opponent.gameBoard.totalShipHits, opponent.gameBoard.totalShipsLength);
  if (opponent.gameBoard.isAllShipsSunk()) {
    gameEnd();
    return;
  }
  // switch turns;
  await sleep(1500); // miliseconds delay before switching rounds;

  switchPlayerTurn();

  if (getPlayerTurn() instanceof AIPlayer) {
    const aiMove = getAINextHit();
    playRound(aiMove);
  }
};
pubSub.subscribe('placedPlayer1Ship', (c) => {
  player1PlacedShips.push(c);
});
