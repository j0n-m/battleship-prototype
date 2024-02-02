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

// player turns
const playerQueue = [];

playerQueue.push(player1, player2);

let playerTurn = playerQueue.shift();

// create 3 ships for each player
// const p1Ships = [new Ship(3), new Ship(3), new Ship(4)];
// const p2Ships = [new Ship(3), new Ship(3), new Ship(4)];
const p1Ships = [new Ship(3), new Ship(3)];
const p2Ships = [new Ship(3), new Ship(3)];

// TEMP - pre-determined coords for ship placement
const p1ShipCoords = [[1, 1], [2, 1], [3, 1], [2, 3], [2, 4], [2, 5], [9, 0], [9, 1], [9, 2], [9, 3]];
const p2ShipCoords = [[5, 0], [5, 1], [5, 2], [7, 0], [7, 1], [7, 2], [6, 5], [7, 5], [8, 5], [9, 5]];

// place the ship at each coord from the array above.
p1Ships.forEach((ship) => {
  for (let i = 0; i < ship.getLength(); i++) {
    if (p1ShipCoords.length === 0) {
      console.log('p1ShipCoords is empty, returning');
      return;
    }
    player1.gameBoard.placeShip(p1ShipCoords.shift(), ship);
  }
});
p2Ships.forEach((ship) => {
  for (let i = 0; i < ship.getLength(); i++) {
    if (p2ShipCoords.length === 0) {
      console.log('p2ShipCoords is empty, returning');
      return;
    }
    player2.gameBoard.placeShip(p2ShipCoords.shift(), ship);
  }
});
// After import initializing test:
// console.log('placed ships, example P1 @ [1,1]', player1.gameBoard.board[1][1]);

//* ************************[Game Functions]***********************************//
export const getPlayerTurn = () => playerTurn;
export const getOppenent = () => playerQueue[0];
export const setPlayerName = (player, newName) => {
  player.setName(newName);
  pubSub.publish('playerNameChanged');
};
export const switchPlayerTurn = () => {
  playerQueue.push(playerTurn);
  playerTurn = playerQueue.shift();
  pubSub.publish('switchTurns');
};
async function sleep(delay) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, delay));
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
  console.log(`~~~~~~~GAME OVER, ${getPlayerTurn().getName()}  WINS ~~~~~~~`);
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
function isWithinBoard(x, y) {
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
export const getRandomCoords = () => {
  const x = parseInt(Math.random() * 10); // bound to game board size of 10
  const y = parseInt(Math.random() * 10);
  return [x, y];
};
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
  const consoleMessage = (!response.status) ? `${player.getName()} MISS @ ${mappedCoords}` : `${player.getName()} HIT @ index ${mappedCoords}`;
  console.log(consoleMessage);
  pubSub.publish('newConsoleMessage', consoleMessage);
  pubSub.publish('renderBoardSquare', response);
  // check if all ships down
  if (opponent.gameBoard.isAllShipsSunk()) {
    gameEnd();
    return;
  }
  // switch turns;
  await sleep(2000); // 2 second delay before switching rounds;

  switchPlayerTurn();

  if (getPlayerTurn() instanceof AIPlayer) {
    const aiMove = getAINextHit();
    playRound(aiMove);
  }
};
