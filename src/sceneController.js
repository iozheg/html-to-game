import * as PIXI from "pixi.js";
import Camera from "./camera";
import GameEngine from "./gameEngine";
import WallObject from "./objects/wallObject";
import TriggerObject from "./objects/triggerObject";
import DecorationObject from "./objects/decorationObject";
import Player from "./objects/playerController";

const TEXTURE_ATTR = "[data-texture-name]";
const TEXTURE_NAME = "textureName";
const TEXTURE_FRAME = "textureFrame";
const OBJECT_ATTR = "[data-scene-object]";
const TRIGGER_ATTR = "[data-scene-trigger]";
const DECORATION_ATTR = "[data-scene-decoration]";
const PLAYER_ATTR = "[data-scene-player]";
const OPTIONS_ATTR = "options";

export default class SceneController {
  /**
   * Creates an instance of SceneController.
   * @param {HTMLElement} sceneContainer
   * @param {HTMLElement} canvasContainer
   * @param {*} options
   * @memberof SceneController
   */
  constructor(sceneContainer, canvasContainer, options = {}) {
    const sceneDims = sceneContainer.getBoundingClientRect();

    this.xRatio = sceneDims.width / 1000;
    this.yRatio = sceneDims.height / 1000;

    this.sceneContainer = sceneContainer;
    this.canvasContainer = canvasContainer;
    this.resources = [];

    this.loadTextures(this.initGame.bind(this));
  }

  initGame() {
    this.camera = new Camera(this.sceneContainer.getBoundingClientRect());
    this.gameEngine = new GameEngine(
      this.canvasContainer,
      this.canvasContainer.getBoundingClientRect(),
      this.camera,
      this.resources
    );
    this.initScene();
  }

  restartGame() {
    this.gameEngine.destroy();
    this.gameEngine = undefined;
    this.camera.destroy();
    this.camera = undefined;
    this.initGame();
  }

  stopGame() {
    this.gameEngine.app.stop();
  }

  loadTextures(initCallback) {
    const divsWithTextures = this.getElementsByDataAttr(TEXTURE_ATTR);
    const textures = new Set();
    divsWithTextures.forEach(div => {
      textures.add(this.getTextureData(div).name);
    });
    PIXI.Loader.shared.add(Array(...textures)).load((loader, resources) => {
      this.resources = resources;
      initCallback();
    });
  }

  initScene() {
    this.createPlayer();
    this.initObjects(OBJECT_ATTR, WallObject);
    this.initObjects(TRIGGER_ATTR, TriggerObject);
    this.initObjects(DECORATION_ATTR, DecorationObject);
  }

  createPlayer() {
    const playerDiv = this.getElementsByDataAttr(PLAYER_ATTR)[0];
    const playerSize = playerDiv.getBoundingClientRect();
    const playerTexture = this.getTextureData(playerDiv);
    const playerOptions = this.getOptions(playerDiv);
    const player = new Player(
      playerSize.width,
      playerSize.height,
      this.getTexture(playerTexture),
      playerDiv,
      playerOptions,
      { x: this.xRatio, y: this.yRatio }
    );
    player.setPosition(playerSize.x, playerSize.y);
    this.gameEngine.addToScene(player);
    this.camera.setTarget(player);
  }

  initObjects(dataAttr, constructor) {
    const objects = this.getElementsByDataAttr(dataAttr);
    objects.forEach(div => {
      const size = div.getBoundingClientRect();
      const texture = this.getTextureData(div);
      const options = this.getOptions(div);
      const object = new constructor(
        size.width,
        size.height,
        this.getTexture(texture),
        div,
        options
      );
      object.setPosition(size.x, size.y);
      this.gameEngine.addToScene(object);

      if (options.debug) setDivTitle(div);
    });
  }

  getElementsByDataAttr(dataAttr) {
    return Array.from(this.sceneContainer.querySelectorAll(dataAttr));
  }

  getData(div, dataName) {
    return div.dataset[dataName];
  }

  getTextureData(div) {
    return {
      name: this.getData(div, TEXTURE_NAME),
      frame: this.getData(div, TEXTURE_FRAME)
    };
  }

  getTexture(texture) {
    const resource = this.resources[texture.name].texture.baseTexture;
    if (texture.frame) {
      const frame = new PIXI.Rectangle(
        ...texture.frame.split(",").map(v => Number(v))
      );
      return new PIXI.Texture(resource, frame);
    }
    return new PIXI.Texture(resource);
  }

  getOptions(div) {
    const optionsStr = this.getData(div, OPTIONS_ATTR) || "{}";
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
}
