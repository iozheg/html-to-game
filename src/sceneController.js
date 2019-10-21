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
    const canvasDims = canvasContainer.getBoundingClientRect();

    this.xRatio = sceneDims.width / 1000;
    this.yRatio = sceneDims.height / 1000;

    this.sceneContainer = sceneContainer;
    this.canvasContainer = canvasContainer;
    this.camera = new Camera(sceneDims);
    this.gameEngine = new GameEngine(
      this.canvasContainer,
      canvasDims,
      this.camera
    );

    this.loadTextures();
  }

  loadTextures() {
    const divsWithTextures = this.getElementsByDataAttr(TEXTURE_ATTR);
    const textures = new Set();
    divsWithTextures.forEach(div => {
      textures.add(this.getTextureData(div).name);
    });

    this.gameEngine.loadTextures(Array(...textures), this.initScene.bind(this));
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
    const playerOptions = this.getOptions(playerDiv);
    const player = new Player(
      playerSize.width,
      playerSize.height,
      undefined,
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
        this.gameEngine.getTexture(texture),
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
