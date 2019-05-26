
import "./style.css";
import "./images/tileset.png";
import "./images/props.png";
import "./images/vue.png";
import GameEngine from "./gameEngine";
import Player from "./playerController";
import WallObject from "./wallObject";
import TriggerObject from "./triggerObject";
import Camera from "./camera";

window.pixiApp;
function getData(div, dataName) {
  return div.dataset[dataName];
}

function getTextureData(div) {
  return {
    name: getData(div, "textureName"),
    frame: getData(div, "textureFrame")
  };
}

function getOptions(div) {
  const optionsStr = getData(div, "options") || "{}";
  try {
    return JSON.parse(optionsStr);
  } catch (e) {
    console.warn(
      `ElementID: "${div.id}" Classes: "${div.classList}"`,
      `[data-options] is not valid JSON string: ${optionsStr}`
    );
    return {};
  }
}

function setDivTitle(div) {
  div.title = div.id + " " + Array(...div.classList).join(" ");
}

function getAllElements(selector) {
  return Array.from(document.querySelectorAll(selector));
    // .filter(node => node.nodeName.toLowerCase() === "div");
}

function createPlayer() {
  const playerDiv = getAllElements("[data-scene-player]")[0];
  const playerSize = playerDiv.getBoundingClientRect();
  const playerOptions = getOptions(playerDiv);
  const player = new Player(
    playerSize.width,
    playerSize.height,
    undefined,
    playerDiv,
    playerOptions
  );
  player.setPosition(playerSize.x, playerSize.y);
  window.pixiApp.addToScene(player);
  window.camera.setTarget(player);
}

function initScene() {
  createPlayer();

  const walls = getAllElements("[data-scene-object]");
  walls.forEach(div => {
    setDivTitle(div);
    const size = div.getBoundingClientRect();
    const texture = getTextureData(div);
    const options = getOptions(div);
    const wall = new WallObject(
      size.width, size.height, pixiApp.getTexture(texture), div, options
    );
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });

  const triggers = getAllElements("[data-scene-trigger]");
  triggers.forEach(div => {
    setDivTitle(div);
    const size = div.getBoundingClientRect();
    const texture = getTextureData(div);
    const options = getOptions(div);
    const wall = new TriggerObject(
      size.width, size.height, pixiApp.getTexture(texture), div, options
    );
    wall.setPosition(size.x, size.y);
    window.pixiApp.addToScene(wall);
  });
}

function startPixi() {
  const container = document.getElementById("pixi-container");
  const dimentions = container.getBoundingClientRect();
  const scene = document.getElementById("dom-container");
  const sceneDimentions = scene.getBoundingClientRect();

  window.camera = new Camera(sceneDimentions);

  window.pixiApp = new GameEngine(container, dimentions, window.camera);

  const divsWithTextures = getAllElements("[data-texture-name]");
  const textures = new Set();
  divsWithTextures.forEach(div => {
    textures.add(getTextureData(div).name);
  });

  pixiApp.loadTextures(Array(...textures), initScene);
}


function initDomElements() {
  startPixi();
}

window.onload = initDomElements;