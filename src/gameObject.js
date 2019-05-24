import * as PIXI from "pixi.js";
import { uuid } from "./utils";

export default class GameObject {
  constructor(width = 10, height = 10, sourceHTMLElement, options) {
    this.sourceHTMLElement = sourceHTMLElement;
    this.engine;
    /** @type {String} */
    this.uuid = uuid();
    this.width = width;
    this.height = height;
    this.position = { x: 0, y: 0 };
    this.options = options || {};
    this.nextPosition = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.hasHitbox = false;
    this.checkForCollisions = false;
    this.object2d;
  }

  create2DObject() {
    this.object2d = new PIXI.DisplayObject();
  }

  beforeUpdate(delta) {}
  update(delta) {}

  attemptMove(x, y) {
    this.nextPosition = { x, y };
    if (this.hasHitbox) {
      this.checkForCollisions = true;
    }
  }

  setPosition(x, y) {
    this.position = {
      x: isFinite(x) ? x : this.position.x,
      y: isFinite(y) ? y : this.position.y
    };
    this.object2d.position = { ...this.position };
  }

  setSize(width, height) {
    this.width = isFinite(width) ? width : this.width;
    this.height = isFinite(height) ? height : this.height;
    this.object2d.width = this.width;
    this.object2d.height = this.height;
  }

  /** 
   * @param {import("./typedef").Collision} collision
   */
  onCollision(collision) {}

  /**
   * @param {GameObject} other
   * @memberof GameObject
   */
  onTrigger(other) {}

  destroy() {
    this.object2d.destroy(true);
    this.engine.removeFromScene(this);
    if (this.sourceHTMLElement) {
      this.sourceHTMLElement.parentNode.removeChild(this.sourceHTMLElement);
    }
  }
  // contains(point) {
  //   const right = this.position.x + this.width;
  //   const bottom = this.position.y + this.height;

  //   if (point.x > this.position.x && point.x < right) {
  //     if (point.y > this.position.y && point.y < bottom) return true;
  //   }

  //   return false;
  // }

  // containsAny(points) {
  //   const right = this.position.x + this.width;
  //   const bottom = this.position.y + this.height;

  //   for (let point of points) {
  //     if (point.x > this.position.x && point.x < right) {
  //       if (point.y > this.position.y && point.y < bottom) return true;
  //     }
  //   }

  //   return false;
  // }
}