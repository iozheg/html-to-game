import GameObject from "./gameObject";

export default class DecorationObject extends GameObject {
  constructor(width, height, texture, sourceHTMLElement, options) {
    super(width, height, sourceHTMLElement, options);

    this.texture = texture;
    this.position = { x: 100, y: 100 };

    this.options = Object.assign({ tiles: true }, this.options);

    this.create2DObject();
  }

  create2DObject() {
    if (this.texture) {
      this.createSprite();
    } else {
      this.createGraphicsObject();
    }
    this.object2d.position = this.position;
    this.object2d.zIndex = -1;
  }
}
