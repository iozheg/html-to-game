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
        const collision = this.checkCollisionsByAxis(source, target);
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
  // checkIntersection(source, target) {
  //   const left = Math.max(source.position.x, target.position.x);
  //   const top = Math.max(source.position.y, target.position.y);
  //   const right = Math.min(
  //     source.position.x + source.width,
  //     target.position.x + target.width
  //   );
  //   const bottom = Math.min(
  //     source.position.y + source.height,
  //     target.position.y + target.height
  //   );

  //   const width = right - left;
  //   const height = bottom - top;

  //   if (!((width < 0) || (height < 0))) {
  //     /* Get axis of impact. */
  //     const containsAnyCorner = source.containsAny([
  //       target.position,
  //       {
  //         x: target.position.x,
  //         y: target.position.y + target.height
  //       },
  //       {
  //         x: target.position.x + target.width,
  //         y: target.position.y + target.height
  //       },
  //       {
  //         x: target.position.x + target.width,
  //         y: target.position.y
  //       }
  //     ]);
  //     if (containsAnyCorner) return { x: 1, y: 1 };
  //     if (width > height) return { x: 0, y: 1};
  //     else return { x: 1, y: 0 };
  //   }
  //   return undefined;
  // }

  /**
   *
   *
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
    }

    const futureObjectY = {
      left: source.position.x,
      top: source.nextPosition.y,
      right: source.position.x + source.width,
      bottom: source.nextPosition.y + source.height
    }

    const targetRect = {
      left: target.position.x,
      top: target.position.y,
      right: target.position.x + target.width,
      bottom: target.position.y + target.height
    }

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

    if (!((width < 0) || (height < 0))) return true;
    return false;
  }
}