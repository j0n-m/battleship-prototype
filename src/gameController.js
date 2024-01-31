/* eslint-disable max-len */
import Ship from './ship';
import GameBoard from './gameBoard';
import Player from './player';
import AIPlayer from './aiPlayer';

export default function game() { // controls game loop - pubsub -> respond to dom initialized gameboard message from domRender.js
  console.log('Begining game() function');

  const gameBoard1 = new GameBoard();
  const gameBoard2 = new GameBoard();

  // temp - hard coded
  const player1 = new Player('P1', gameBoard1);
  const player2 = new AIPlayer(gameBoard2);

  const p1Ships = [new Ship(3), new Ship(3), new Ship(4)];
  const p2Ships = [new Ship(3), new Ship(3), new Ship(4)];

  // placing ships at hard-coded coords
  const p1ShipCoords = [[1, 1], [2, 1], [3, 1], [2, 3], [2, 4], [2, 5], [9, 0], [9, 1], [9, 2], [9, 3]];
  const p2ShipCoords = [[5, 0], [5, 1], [5, 2], [7, 0], [7, 1], [7, 2], [6, 5], [7, 5], [8, 5], [9, 5]];

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
  console.log('placed ships, example P1 @ [9,0]', player1.gameBoard.board[9][0]);

  //
}
