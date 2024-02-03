/* eslint-disable no-use-before-define */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
import AIPlayer from './aiPlayer';
import * as game from './gameController';
import pubSub from './pubSub';

console.log('domController Initialized');
// Variables set here
const devMode = true;
// eslint-disable-next-line prefer-const
let isShipsHorizontal = true;
// const shipLength = game.testP1Ships[0]?.getLength() ?? 0;
// eslint-disable-next-line prefer-const
const gameConsole = document.querySelector('[data-console]');
const board1 = document.querySelector('[data-board-1]');
const board2 = document.querySelector('[data-board-2]');
const boardTurnQueue = [];
const endGameModal = document.getElementById('end-game-modal');
const playerChooseNameModal = document.getElementById('player-name-modal');
const placeShipsModal = document.getElementById('place-ships-modal');
const endGameForm = document.getElementById('endGameForm');
const placeShipsBoard = document.querySelector('.placeShipsBoard');
// endGameModal.showModal();
// playerChooseNameModal.showModal();
placeShipsModal.showModal();
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
  console.log('DEVMODE IS ON, SHOWING ALL SHIPS ON GAMEBOARD');
  for (let row = 0; row < size; row++) { // row - x index
    for (let col = 0; col < size; col++) { // column - y index
      const square = document.createElement('div');
      const squareDup = square.cloneNode();
      if (devMode) {
        square.textContent = (game.isAHitP(row, col, game.player1)) ? 'Ship' : '';

        squareDup.textContent = (game.isAHitP(row, col, game.player2)) ? 'Ship' : '';
      } else {
        square.textContent = (game.isAHitP(row, col, game.player1)) ? 'Ship' : '';
      }

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
const renderPlaceShipsHeader = (headerContainer) => {
  for (let i = 0; i <= 10; i++) {
    const headerSquare = document.createElement('div');
    headerSquare.classList.add('ph-square');
    headerSquare.textContent = (i === 0) ? '' : i;
    headerContainer.appendChild(headerSquare);
  }
};
const renderPlaceShipsSideHeader = (sideHeaderContainer) => {
  const headerText = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  for (let i = 0; i < 10; i++) {
    const sideHeaderSquare = document.createElement('div');
    sideHeaderSquare.classList.add('psh-square');
    sideHeaderSquare.textContent = headerText.shift();
    sideHeaderContainer.appendChild(sideHeaderSquare);
  }
};
const renderPlaceShipsBody = () => {
  // placeShipsBoard
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = document.createElement('div');
      square.classList.add('pSquare');
      square.dataset.x = row;
      square.dataset.y = col;
      placeShipsBoard.appendChild(square);
    }
  }
};
const renderPlaceShipsBoard = () => {
  const squareHeader = document.createElement('div');
  squareHeader.classList.add('pSquareHeader');
  const squareSideHeader = document.createElement('div');
  squareSideHeader.classList.add('pSquareSideHeader');

  placeShipsBoard.appendChild(squareHeader);
  placeShipsBoard.appendChild(squareSideHeader);

  renderPlaceShipsHeader(squareHeader);
  renderPlaceShipsSideHeader(squareSideHeader);
  renderPlaceShipsBody();
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
  const endGameModalText = endGameModal.querySelector('.end-game-modal-text');
  endGameModalText.textContent = `${game.getPlayerTurn().getName()} Won The Game!`;
  endGameModal.showModal();
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
const disableEscOnModals = () => {
  const modals = document.querySelectorAll('dialog');
  modals.forEach((modal) => {
    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
    });
  });
};
const showStartingModal = () => {
  playerChooseNameModal.showModal();
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
const pbcb = (e) => {
  const affectedSq = document.querySelectorAll('.hover-preview');
  if (game.getPlayer1CurrentShipLength() === 0) {
    placeShipsBoard.pointerEvents = 'none';
    return;
  }
  const filtered = [...affectedSq].filter((sq) => !sq.classList.contains('placed'));
  console.log('filtered', filtered);
  if (filtered.length !== game.getPlayer1CurrentShipLength()) {
    console.log('not placing');
    return;
  }
  console.log('Current Ship with Length:', game.getPlayer1CurrentShipLength());
  console.log('game variable arr', game.testP1Ships);
  filtered.forEach((el) => {
    el.classList.remove('hover-preview');
    el.classList.add('placed');
    // currentShip = game.testP1Ships.shift();
    console.log('adding', el);
  });
  game.testP1Ships.shift();
  console.log(game.testP1Ships.length, 'ships left');
};
const renderShipBoardClick = () => {
  const affectedSq = document.querySelectorAll('.hover-preview');
  // eslint-disable-next-line no-restricted-syntax
  affectedSq.forEach((sq) => {
    sq.addEventListener('click', pbcb, true);
  });
};
const initializeEventListeners = () => {
  // add click events to each square in board1 and board 1
  const board1Squares = board1.querySelectorAll('[data-target-active="true"]');
  const board2Squares = board2.querySelectorAll('[data-target-active="true"]');
  const continueBtn = document.getElementById('playerNameModalContinueBtn');
  const placeShipsboardSquares = placeShipsBoard.querySelectorAll('.pSquare');

  board1Squares.forEach((square) => {
    square.addEventListener('click', prepareRoundCB, true);
  });
  board2Squares.forEach((square) => {
    square.addEventListener('click', prepareRoundCB, true);
  });
  endGameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.location.reload();
  });
  continueBtn.addEventListener('click', () => {
    playerChooseNameModal.closeModal();
    placeShipsModal.showModal();
  });
  // 3 3;
  placeShipsboardSquares.forEach((square) => {
    square.addEventListener('mouseover', (e) => {
      // const shipLength = game.testP1Ships[0]?.getLength() ?? 0;
      if (game.getPlayer1CurrentShipLength() === 0) return;

      // const currentSquare = e.target;
      // const targetX = Number(e.target.dataset.x);
      // const targetY = Number(e.target.dataset.Y);
      const affectedSquares = []; // array of elements that will show in preview
      // affectedSquares.push(currentSquare);
      // const filteredArr = [];

      isShipsHorizontal = true; // test
      const anchorLetter = (isShipsHorizontal) ? 'x' : 'y';
      const anchorNum = (isShipsHorizontal) ? Number(e.target.dataset.x) : Number(e.target.dataset.y);
      const oppositeLetter = (anchorLetter === 'x') ? 'y' : 'x';
      let oppositeNum = Number(e.target.dataset[oppositeLetter]);

      // let oppositeNumForLoop = oppositeNum;
      // pushes all affected elements to array
      let currentSquare = e.target;
      for (let i = 0; i < game.getPlayer1CurrentShipLength(); i++) {
        if (currentSquare !== null && game.isWithinBoard(currentSquare.dataset.x, currentSquare.dataset.y) && !currentSquare.classList.contains('placed')) {
          affectedSquares.push(currentSquare);
          oppositeNum++;
          currentSquare = document.querySelector(`[data-${anchorLetter}="${anchorNum}"][data-${oppositeLetter}="${oppositeNum}"]`);
        }
      }
      // console.log('preview squares', affectedSquares);
      let counter = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const pvSq of affectedSquares) {
        if (pvSq.classList.contains('placed')) {
          console.log('filtered out items in affectedSquare');
          affectedSquares.splice(counter, 1);
        }
        pvSq.classList.add('hover-preview');
        counter++;
      }
      renderShipBoardClick();
      // maybe a work around
      // for (const element of affectedSquares) {
      //   if (element.classList.contains('placed')) return;
      // }
      // console.log('nothing placed here');
      affectedSquares.forEach((element) => {
        // if (anchorNum === Number(element.dataset[anchorLetter])) {
        // console.log(Number(element.dataset[anchorLetter]));
        // filteredArr.push(element);
        // if (element.classList.contains('placed')) {

        // }
        // element.classList.add('hover-preview');

        // console.log(element);

        element.addEventListener('mouseout', () => {
          affectedSquares.forEach((el) => {
            el.classList.remove('hover-preview');
          });
        });
      });
      // renderShipBoardClick(affectedSquares);
    });
  });
};
export const initialize = () => {
  console.log('domController init()');
  console.log('Begining DOM GameBoard Rendering');
  renderGameBoard();
  renderPlaceShipsBoard();
  // renderShipBoardClick();
  initializeEventListeners();
  disableEscOnModals();
  // showStartingModal();
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
