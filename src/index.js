import './style.css';
import game from './gameController';
import renderGameBoard from './domRender';

game(); // initializes game logic section
renderGameBoard(); // initializes game board
// initialize DOM event listeners -> package with DomRenderjs?

// most interactions will be:
// domRenderer(events) <-> PubSub <-> gameController/classes
