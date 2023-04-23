const {App} = require('./app.js');
import "./styles/style_2.css";
import "./styles/gamemenu.css";
import "./styles/bar-indicator.css";
import "./styles/game-screen.css";
import "./styles/gm-screen.css";

const mainNode = document.querySelector('#app-main');

const app = new App(
  mainNode
);

window.app = app; // allow browser console access
