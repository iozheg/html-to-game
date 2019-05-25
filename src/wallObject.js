import * as PIXI from "pixi.js";
import GameObject from "./gameObject";

export default class WallObject extends GameObject {
  constructor(width, height, texture, sourceHTMLElement, options) {
    super(width, height, sourceHTMLElement, options);

    this.texture = texture;
    this.position = { x: 100, y: 100 };

    this.options = Object.assign(
      { hasHitbox: true, tiles: true },
      this.options
    );

    this.create2DObject();
  }

  create2DObject() {
    if (this.texture) {
      this.createSprite();
    } else {
      this.createGraphicsObject();
    }
    this.object2d.position = this.position;
  }
}