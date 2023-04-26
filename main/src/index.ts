import { App } from './app';
import "./styles/style_2.css";
import "./styles/gamemenu.css";
import "./styles/bar-indicator.css";
import "./styles/game-screen.css";
import "./styles/gm-screen.css";

const mainNode = document.querySelector<HTMLDivElement>('#app-main');

const app = new App(
  mainNode
);

(window as any).app = app; // allow browser console access
