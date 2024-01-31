// render player 1 and player 2 boards with
export function renderGameBoardHeader(size, boardLeft, boardRight) {
  console.log('Rendering Game Board Header');
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
  console.log('Rendering Game Board Body');
  for (let row = 0; row < size; row++) { // row - x index
    for (let col = 0; col < size; col++) { // column - y index
      const square = document.createElement('div');
      const squareDup = square.cloneNode();

      square.textContent = 'test';
      squareDup.textContent = 'test';

      square.classList.add('square');
      squareDup.classList.add('square');

      square.dataset.x = row;
      squareDup.dataset.x = row;

      square.dataset.y = col;
      squareDup.dataset.y = col;

      square.dataset.targetActive = false;
      squareDup.dataset.targetActive = false;

      boardLeft.appendChild(square);
      boardRight.appendChild(squareDup);
    }
  }
}
export default function renderGameBoard() {
  const size = 10;
  const boardLeft = document.querySelector('.board-left');
  const boardRight = document.querySelector('.board-right');

  console.log('Begining DOM GameBoard Rendering');
  renderGameBoardHeader(size, boardLeft, boardRight);
  renderGameBoardBody({ size, boardLeft, boardRight });
}
