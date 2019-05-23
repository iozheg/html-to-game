
import "./style.css";
import "./images/tileset.png";
import "./images/vue.png";
import GameEngine from "./gameEngine";
import Player from "./playerController";
import WallObject from "./wallObject";
import CollectableObject from "./collectableObject";

window.pixiApp;
window.divs;

function getData(div, dataName) {
  return div.dataset[dataName];
}

function getTextureData(div) {
  return {
    name: getData(div, "textureName"),
    frame: getData(div, "textureFrame")
  };
}

function setDivTitle(div) {
  div.title = div.id + " " + Array(...div.classList).join(" ");
}

function getAllElements(selector) {
  return Array.from(document.querySelectorAll(selector));
    // .filter(node => node.nodeName.toLowerCase() === "div");
}

function initScene() {
  const playerDiv = getAllElements("[data-scene-player]")[0];
  const playerSize = playerDiv.getBoundingClientRect();
  const player = new Player(playerSize.width, playerSize.height);
  player.setPosition(playerSize.x, playerSize.y);
  window.pixiApp.addToScene(player);

  window.divs.forEach(div => {
    setDivTitle(div);
    const size = div.getBoundingClientRect();
    const texture = getTextureData(div);
    const wall = new WallObject(
      size.width, size.height, pixiApp.getTexture(texture), div
    );
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });

  window.collectable.forEach(div => {
    setDivTitle(div);
    const size = div.getBoundingClientRect();
    const texture = getTextureData(div);
    const wall = new CollectableObject(
      size.width, size.height,  pixiApp.getTexture(texture), div
    );
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });
}

function startPixi() {
  const container = document.getElementById("pixi-container");
  const dimentions = container.getBoundingClientRect();

  window.pixiApp = new GameEngine(container, dimentions);

  const divsWithTextures = getAllElements("[data-texture-name]");
  const textures = new Set();
  divsWithTextures.forEach(div => {
    textures.add(getTextureData(div).name);
  });

  pixiApp.loadTextures(Array(...textures), initScene);
}


function initDomElements() {
  window.divs = getAllElements("[data-scene-object]");
  window.collectable = getAllElements("[data-scene-collectable]");

  startPixi();
}

window.onload = initDomElements;