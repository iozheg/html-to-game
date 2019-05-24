import * as PIXI from "pixi.js";
import GameObject from "./gameObject";

export default class WallObject extends GameObject {
  constructor(width, height, texture, sourceHTMLElement, options) {
    super(width, height, sourceHTMLElement, options);

    this.texture = texture;
    this.position = { x: 100, y: 100 };

    this.options.hasHitbox = true;

    this.create2DObject();
  }

  create2DObject() {
    if (this.texture) {
      this.object2d = new PIXI.TilingSprite(
        this.texture,
        this.width,
        this.height
      );

      let scale = this.height > this.width
        ? this.width / this.texture.width
        : this.height / this.texture.height;
      scale = Math.ceil(scale * 10) / 10;
      this.object2d.tileScale = { x: scale, y: scale };
    } else {
      this.object2d = new PIXI.Graphics();
      this.object2d.lineStyle(1, 0x00, 1);
      this.object2d.drawRect(0, 0, this.width, this.height);
    }
    this.object2d.position = this.position;
  }
}