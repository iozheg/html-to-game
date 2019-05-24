import * as PIXI from "pixi.js";
import GameObject from "./gameObject";

export default class CollectableObject extends GameObject {
  constructor(width, height, texture, sourceHTMLElement) {
    super(width, height, sourceHTMLElement);

    this.texture = texture;
    this.position = { x: 100, y: 100 };
    this.hasHitbox = true;
    this.isTrigger = true;
    this.isCollectable = true;

    this.create2DObject();
  }

  create2DObject() {
    if (this.texture) {
      this.object2d = new PIXI.Sprite(this.texture);
      this.object2d.width = this.width;
      this.object2d.height = this.height;
    } else {
      this.object2d = new PIXI.Graphics();
      this.object2d.lineStyle(1, 0x00, 1);
      this.object2d.drawRect(0, 0, this.width, this.height);
    }
  }

  /**
   * @param {GameObject} other
   * @memberof CollectableObject
   */
  onTrigger(other) {
    this.destroy();
  }

  update(delta) {
    const { width, height, x, y } = this.sourceHTMLElement.getBoundingClientRect();
    this.setSize(width, height);
    this.setPosition(x, y);
  }
}