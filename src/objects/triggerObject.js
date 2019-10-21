import GameObject from "./gameObject";

export default class TriggerObject extends GameObject {
  constructor(width, height, texture, sourceHTMLElement, options) {
    super(width, height, sourceHTMLElement, options);

    this.texture = texture;
    this.position = { x: 100, y: 100 };

    this.options = Object.assign(
      { hasHitbox: true, isTrigger: true },
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

  /**
   * @param {GameObject} other
   * @memberof TriggerObject
   */
  onTrigger(other) {
    if (this.options.collectable) this.destroy();
  }

  update(delta) {
    if (this.options.animate) {
      const bounds = this.sourceHTMLElement.getBoundingClientRect();
      this.setSize(bounds.width, bounds.height);
      this.setPosition(bounds.x, bounds.y);
    }
  }
}
