import * as PIXI from "pixi.js";
import { uuid } from "./utils";

export default class GameObject {
  constructor(width = 10, height = 10) {
    /** @type {String} */
    this.uuid = uuid();
    this.width = width;
    this.height = height;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.hasHitbox = false;
    this.checkForCollisions = false;
    this.object2d;

    this.create2DObject();
  }

  create2DObject() {
    this.object2d = new PIXI.DisplayObject();
  }

  beforeUpdate(delta) {}
  update(delta) {}

  preCheckPosition(x, y) {
    this.position = { x, y };
    if (this.hasHitbox) {
      this.checkForCollisions = true;
    }
  }

  setPosition(x, y) {
    this.position = { x, y };
    this.object2d.position = { x, y };
  }

  /** 
   * @param {import("./typedef").Collision} collision
   */
  onCollision(collision) {}
}