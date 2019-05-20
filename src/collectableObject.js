import * as PIXI from "pixi.js";
import GameObject from "./gameObject";

export default class CollectableObject extends GameObject {
  constructor(width, height) {
    super(width, height);

    this.position = { x: 100, y: 100 };
    this.hasHitbox = true;
    this.isTrigger = true;
    this.isCollectable = true;

    this.create2DObject();
  }

  create2DObject() {
    this.object2d = new PIXI.Graphics();
    this.object2d.lineStyle(1, 0x00, 1);
    this.object2d.drawRect(0, 0, this.width, this.height);
    this.object2d.position = this.position;
  }

  /**
   * @param {GameObject} other
   * @memberof CollectableObject
   */
  onTrigger(other) {
    // this.destroy();
  }
}