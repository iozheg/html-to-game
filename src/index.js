
import "./style.css";
import GameEngine from "./gameEngine";
import Player from "./playerController";
import WallObject from "./wallObject";

window.pixiApp;
window.divs;

function getData(div) {
  return div.dataset.sceneObject;
}

function getAllElements(selector) {
  return Array.from(document.querySelectorAll(selector));
    // .filter(node => node.nodeName.toLowerCase() === "div");
}


function startPixi() {
  const container = document.getElementById("pixi-container");
  const dimentions = container.getBoundingClientRect();

  window.pixiApp = new GameEngine(container, dimentions);

  window.pixiApp.addToScene(new Player(20, 20));

  window.divs.forEach(div => {
    const size = div.getBoundingClientRect();
    const wall = new WallObject(size.width, size.height);
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });
}


function initDomElements() {
  window.divs = getAllElements("[data-scene-object]");

  startPixi();
}

window.onload = initDomElements;