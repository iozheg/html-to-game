import * as PIXI from "pixi.js";
import GameObject from "./objects/gameObject";
import Player from "./objects/playerController";
import Camera from "./camera";
import eventSystem from "./eventSystem";

export default class GameEngine {
  /**
   *Creates an instance of GameEngine.
   * @param {HTMLElement} parentDOMElement
   * @param {{width: number, height: number}} sceneSize
   * @param {Camera} camera
   * @memberof GameEngine
   */
  constructor(parentDOMElement, sceneSize, camera) {
    this.app = undefined;
    /** @type {GameObject[]} */
    this.gameObjects = [];
    this.gameObjectsContainer = new PIXI.Container();
    this.gameObjectsContainer.sortableChildren = true;

    this.camera = camera;

    this.app = new PIXI.Application({
      width: sceneSize.width,
      height: sceneSize.height,
      autoResize: true,
      antialias: true,
      forceFXAA: true,
      transparent: true
    });
    parentDOMElement.appendChild(this.app.view);
    console.log(this.app);

    this.app.stage.addChild(this.gameObjectsContainer);
    this.app.ticker.add(delta => this.update(delta));
    this.app.stage.position = {
      x: this.app.renderer.width / 2,
      y: this.app.renderer.height / 2
    };
    this.camera.setLimits(this.app.renderer);

    eventSystem
      .on("object.destroy")
      .subscribe(event => this.removeFromScene(event.data));
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
    const goIndex = this.gameObjects.findIndex(
      go => go.uuid === gameObject.uuid
    );
    if (goIndex) {
      this.gameObjects.splice(goIndex, 1);
      this.gameObjectsContainer.removeChild(gameObject.object2d);
    }
  }

  update(delta) {
    this.gameObjects.forEach(go => go.beforeUpdate(delta));
    this.detectCollisions();
    this.gameObjects.forEach(go => go.update(delta));

    this.camera.setCameraPosition(this.app.stage);
  }

  /**
   * Detects collision between player and different objects that has
   * hitbox.
   *
   * @memberof GameEngine
   */
  detectCollisions() {
    const sources = this.gameObjects.filter(go => go instanceof Player);
    const targets = this.gameObjects.filter(go => go.options.hasHitbox);

    for (const source of sources) {
      for (const target of targets) {
        /* Skip source itself and if source or target is destroyed. */
        if (
          source.uuid === target.uuid ||
          source.isDestroyed ||
          target.isDestroyed
        )
          continue;
        this.checkCollision(source, target);
      }
    }
  }

  /**
   * Checks collision between two objects.
   * If target is trigger than just check intersection and call onTrigger.
   * Else detect axis of collision and call onCollision.
   *
   * @param {GameObject} source
   * @param {GameObject} target
   * @returns {import("./typedef").Collision}
   * @memberof GameEngine
   */
  checkCollision(source, target) {
    let collision;
    if (target.options.isTrigger) {
      collision = this.checkCollisionBasic(source, target);
      if (collision) {
        source.onTrigger(target);
        target.onTrigger(source);
      }
    } else {
      collision = this.checkCollisionsByAxis(source, target);
      if (collision) {
        source.onCollision({ other: target, axis: collision });
        target.onCollision({ other: source, axis: collision });
      }
    }
  }

  /**
   * @param {GameObject} source
   * @param {GameObject} target
   * @returns {import("./typedef").Collision}
   * @memberof GameEngine
   */
  checkCollisionBasic(source, target) {
    const sourceRect = {
      left: source.nextPosition.x,
      top: source.nextPosition.y,
      right: source.nextPosition.x + source.width,
      bottom: source.nextPosition.y + source.height
    };
    const targetRect = {
      left: target.position.x,
      top: target.position.y,
      right: target.position.x + target.width,
      bottom: target.position.y + target.height
    };

    if (this.checkRectIntersection(sourceRect, targetRect)) {
      return true;
    }

    return false;
  }

  /**
   * @param {GameObject} source
   * @param {GameObject} target
   * @returns {import("./typedef").Collision}
   * @memberof GameEngine
   */
  checkCollisionsByAxis(source, target) {
    const futureObjectX = {
      left: source.nextPosition.x,
      top: source.position.y,
      right: source.nextPosition.x + source.width,
      bottom: source.position.y + source.height
    };

    const futureObjectY = {
      left: source.position.x,
      top: source.nextPosition.y,
      right: source.position.x + source.width,
      bottom: source.nextPosition.y + source.height
    };

    const targetRect = {
      left: target.position.x,
      top: target.position.y,
      right: target.position.x + target.width,
      bottom: target.position.y + target.height
    };

    if (this.checkRectIntersection(futureObjectX, targetRect)) {
      return { x: 1, y: 0 };
    } else if (this.checkRectIntersection(futureObjectY, targetRect)) {
      return { x: 0, y: 1 };
    }

    return undefined;
  }

  /**
   *
   *
   * @param {import("./typedef").Rectangle} source
   * @param {import("./typedef").Rectangle} target
   * @memberof GameEngine
   */
  checkRectIntersection(source, target) {
    const left = Math.max(source.left, target.left);
    const top = Math.max(source.top, target.top);
    const right = Math.min(source.right, target.right);
    const bottom = Math.min(source.bottom, target.bottom);

    const width = right - left;
    const height = bottom - top;

    if (!(width < 0 || height < 0)) return true;
    return false;
  }

  destroy() {
    this.app.destroy(true, true);
    this.gameObjects = [];
    this.camera = undefined;
  }
}
