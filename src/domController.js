/* eslint-disable no-use-before-define */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
import * as game from './gameController';
import pubSub from './pubSub';

console.log('domController Initialized');
// Variables set here
const gameConsole = document.querySelector('[data-console]');
const board1 = document.querySelector('[data-board-1]');
const board2 = document.querySelector('[data-board-2]');
const boardTurnQueue = [];
boardTurnQueue.push(board1, board2);

let boardTurn = boardTurnQueue.shift();
boardTurn.style.pointerEvents = 'none';
// Functions
// render player 1 and player 2 boards with
function prepareRoundCB(e) {
  prepareRound(e.target);
}
export function renderGameBoardHeader(size, boardLeft, boardRight) {
  const boardLeftSideHeaderContainer = boardLeft.querySelector('.board-container-side-header');
  const boardLeftHeaderContainer = boardLeft.querySelector('.board-container-header');

  const boardRightSideHeaderContainer = boardRight.querySelector('.board-container-side-header');
  const boardRightHeaderContainer = boardRight.querySelector('.board-container-header');

  // create square.header
  for (let i = 0; i <= size; i++) {
    const square = document.createElement('div');
    const squareDup = square.cloneNode();
    square.classList.add('square', 'header');
    squareDup.classList.add('square', 'header');
    if (i === 0) {
      square.textContent = '';
      squareDup.textContent = '';
    } else {
      square.textContent = i;
      squareDup.textContent = i;
    }
    boardLeftHeaderContainer.appendChild(square);
    boardRightHeaderContainer.appendChild(squareDup);
  }
  const headerTitle = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  // create .square.side-header
  for (let i = 0; i <= size; i++) {
    const square = document.createElement('div');
    const squareDup = square.cloneNode();
    square.classList.add('square', 'side-header');
    squareDup.classList.add('square', 'side-header');
    const title = headerTitle.shift();
    square.textContent = title;
    squareDup.textContent = title;
    boardLeftSideHeaderContainer.appendChild(square);
    boardRightSideHeaderContainer.appendChild(squareDup);
  }
}
export function renderGameBoardBody({ size, boardLeft, boardRight }) {
  for (let row = 0; row < size; row++) { // row - x index
    for (let col = 0; col < size; col++) { // column - y index
      const square = document.createElement('div');
      const squareDup = square.cloneNode();

      square.textContent = 'null';
      squareDup.textContent = 'null';

      square.classList.add('square');
      squareDup.classList.add('square');

      square.dataset.x = row;
      squareDup.dataset.x = row;

      square.dataset.y = col;
      squareDup.dataset.y = col;

      square.dataset.targetActive = true;
      squareDup.dataset.targetActive = true;

      boardLeft.appendChild(square);
      boardRight.appendChild(squareDup);
    }
  }
}
export function renderGameBoard() {
  const size = 10;
  const boardLeft = document.querySelector('.board-left');
  const boardRight = document.querySelector('.board-right');

  renderGameBoardHeader(size, boardLeft, boardRight);
  renderGameBoardBody({ size, boardLeft, boardRight });
}
const prepareRound = (element) => {
  const coords = [Number(element.dataset.x), Number(element.dataset.y)];
  console.log('opponent board', game.getOppenent().gameBoard);
  game.playRound(coords);
  // eslint-disable-next-line no-param-reassign
  element.dataset.targetActive = 'false'; // visually will disable the cursor pointer
  // eslint-disable-next-line prefer-arrow-callback
  element.removeEventListener('click', prepareRoundCB, true);
  // console.log('trying to remove eventlistener to', element);
};
const setConsole = (str) => {
  gameConsole.textContent = str;
  console.log('set new message in console');
};
const gameWin = () => {
  // block all click events to board;
  boardTurnQueue[0].style.pointerEvents = 'none';
  setConsole(`${game.getPlayerTurn().getName()} Wins!`);
  // display ending modal
};
const renderBoardSquare = ({ coords, status }) => {
  const board = boardTurnQueue[0];
  const [x, y] = coords;
  // eslint-disable-next-line quotes
  const square = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  console.log('changing this square', square);
  if (status) {
    square.dataset.hit = 'true';
    return;
  }
  square.dataset.hit = 'false';
};
const updatePlayerNameBanners = () => {
  const player1Name = game.player1.getName();
  const player2Name = game.player2.getName();
  const player1Banner = board1.closest('.board-container').querySelector('.board-name');
  const player2Banner = board2.closest('.board-container').querySelector('.board-name');
  player1Banner.textContent = player1Name;
  player2Banner.textContent = player2Name;
  console.log('Updated player name banners');
};
const switchBoardTurn = () => {
  console.log('switching turns');
  // set current board to allow clicks
  boardTurn.style.pointerEvents = 'auto';
  // switch turns via queue
  boardTurnQueue.push(boardTurn);
  boardTurn = boardTurnQueue.shift();
  // set new board to disable clicks
  boardTurn.style.pointerEvents = 'none';
  setConsole(`${game.getPlayerTurn().getName()}'s Turn`);
};
const initializeEventListeners = () => {
  // add click events to each square in board1 and board 1
  const board1Squares = board1.querySelectorAll('[data-target-active="true"]');
  const board2Squares = board2.querySelectorAll('[data-target-active="true"]');
  board1Squares.forEach((square) => {
    square.addEventListener('click', prepareRoundCB, true);
  });
  board2Squares.forEach((square) => {
    square.addEventListener('click', prepareRoundCB, true);
  });
};
export const initialize = () => {
  console.log('domController init()');
  console.log('Begining DOM GameBoard Rendering');
  renderGameBoard();
  initializeEventListeners();
  console.log('Done rendering DOM GameBoard');
  // console.log('player turn =>', game.getPlayerTurn());
  // show modal -> selects if PvP or PvC, then select names, then select ship positions
  // process the data from modal
  // update console on instructions
  game.setPlayerName(game.player1, 'Big One');
  setConsole(`${game.getPlayerTurn().getName()}'s turn.`);
};
// Any Event listeners that need to be initialize before initilize() is set below
pubSub.subscribe('playerNameChanged', updatePlayerNameBanners);
pubSub.subscribe('switchTurns', switchBoardTurn);
pubSub.subscribe('newConsoleMessage', setConsole);
pubSub.subscribe('gameWin', gameWin);
pubSub.subscribe('renderBoardSquare', renderBoardSquare);
