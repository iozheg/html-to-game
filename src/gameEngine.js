import * as PIXI from "pixi.js";
import GameObject from "./gameObject";

export default class GameEngine {
  /**
   *Creates an instance of GameEngine.
   * @param {HTMLElement} parentDOMElement
   * @param {{width: number, height: number}} sceneSize
   * @memberof GameEngine
   */
  constructor(parentDOMElement, sceneSize) {
    this.app = undefined;
    /** @type {GameObject[]} */
    this.gameObjects = [];
    this.gameObjectsContainer = new PIXI.Container();

    this.app = new PIXI.Application({
      width: sceneSize.width,
      height: sceneSize.height-3,
      autoResize: true,
      antialias: true,
      forceFXAA: true,
      transparent: true,
    });
    parentDOMElement.appendChild(this.app.view);
    console.log(this.app);

    this.app.stage.addChild(this.gameObjectsContainer);
    this.app.ticker.add(delta => this.update(delta));
  }

  /**
   * @param {GameObject} gameObject
   * @memberof GameEngine
   */
  addToScene(gameObject) {
    this.gameObjects.push(gameObject);
    this.gameObjectsContainer.addChild(gameObject.object2d);
  }

  /**
   * @param {GameObject} gameObject
   * @memberof GameEngine
   */
  removeFromScene(gameObject) {
    const goIndex = this.gameObjects
      .findIndex(go => go.uuid === gameObject.uuid);
    if (goIndex) {
      this.gameObjects.splice(goIndex, 1);
      this.gameObjectsContainer.removeChild(gameObject.object2d);
    }
  }

  update(delta) {
    this.gameObjects.forEach(go => go.beforeUpdate(delta));
    this.detectCollisions();
    this.gameObjects.forEach(go => go.update(delta));
  }

  detectCollisions() {
    const sources = this.gameObjects.filter(go => go.checkForCollisions);
    const targets = this.gameObjects.filter(go => go.hasHitbox);

    for (const source of sources) {
      for (const target of targets) {
        if (source.uuid === target.uuid) continue;
        const collision = this.checkIntersection(source, target);
        if (collision) {
          source.checkForCollisions = false;
          source.onCollision({ other: target, axis: collision });
        }
      }
    }
  }

  /**
   *
   *
   * @param {GameObject} source
   * @param {GameObject} target
   * @returns {import("./typedef").Collision}
   * @memberof GameEngine
   */
  checkIntersection(source, target) {
    const left = Math.max(source.position.x, target.position.x);
    const top = Math.max(source.position.y, target.position.y);
    const right = Math.min(
      source.position.x + source.width,
      target.position.x + target.width
    );
    const bottom = Math.min(
      source.position.y + source.height,
      target.position.y + target.height
    );

    const width = right - left;
    const height = bottom - top;

    if (!((width < 0) || (height < 0))) {
      /* Get axis of impact. */
      if (width > height) return { x: 0, y: 1};
      else return { x: 1, y: 0 };
    }
    return undefined;
  }
}