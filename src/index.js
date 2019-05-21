
import "./style.css";
import GameEngine from "./gameEngine";
import Player from "./playerController";
import WallObject from "./wallObject";
import CollectableObject from "./collectableObject";

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

  const player = new Player(20, 20);
  player.setPosition(40, 40);
  window.pixiApp.addToScene(player);

  window.divs.forEach(div => {
    const size = div.getBoundingClientRect();
    const wall = new WallObject(size.width, size.height, div);
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });

  window.collectable.forEach(div => {
    const size = div.getBoundingClientRect();
    const wall = new CollectableObject(size.width, size.height, div);
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });
}


function initDomElements() {
  window.divs = getAllElements("[data-scene-object]");
  window.collectable = getAllElements("[data-scene-collectable]");

  startPixi();
}

window.onload = initDomElements;