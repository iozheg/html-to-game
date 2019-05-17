import * as PIXI from "pixi.js";
import GameObject from "./gameObject";
import { log } from "./utils";

const MOVE_SPEED = 5;

export default class Player extends GameObject {
  constructor(width, height) {
    super(width, width);

    this.hasHitbox = true;

    this.keyboardController();
  }

  create2DObject() {
    this.object2d = new PIXI.Graphics();
    this.object2d.name = "player";
    this.object2d.lineStyle(3, 0x00, 1);
    this.object2d.drawRect(0, 0, this.width, this.height);
    this.object2d.position = this.position;
  }

  keyboardController() {
    window.addEventListener("keyup", this.keyUpHandler.bind(this));
    window.addEventListener("keydown", this.keyDownHandler.bind(this));
  }

  keyDownHandler(event) {
    switch(event.key) {
      case "ArrowUp":
        this.velocity.y = -MOVE_SPEED;
        break;
      case "ArrowDown":
        this.velocity.y = MOVE_SPEED;
        break;
      case "ArrowLeft":
        this.velocity.x = -MOVE_SPEED;
        break;
      case "ArrowRight":
        this.velocity.x = MOVE_SPEED;
        break;
    }
  }

  keyUpHandler(event) {
    switch(event.key) {
      case "ArrowUp":
      case "ArrowDown":
        this.velocity.y = 0;
        break;
      case "ArrowLeft":
      case "ArrowRight":
        this.velocity.x = 0;
        break;
    }
  }

  /**
   * Sets object's position near second object of collision.
   *
   * @param {import("./typedef").Collision}
   * @memberof Player
   */
  onCollision({ other, axis}) {
    /* Set previous position. */
    this.position.x = this.object2d.position.x;
    this.position.y = this.object2d.position.y;

    /* Find out side of collision for each axis and set object near. */
    if (axis.x > 0) {
      if (this.position.x > other.position.x + other.width) {
        this.position.x = other.position.x + other.width + 1;
      } else if (this.position.x + this.width < other.position.x) {
        this.position.x = other.position.x - this.width - 1;
      }
    }

    if (axis.y > 0) {
      if (this.position.y > other.position.y + other.height) {
        this.position.y = other.position.y + other.height + 1;
      } else if (this.position.y + this.height < other.position.y) {
        this.position.y = other.position.y - this.width - 1;
      }
    }
  }

  beforeUpdate(delta) {
    if (this.velocity.x !== 0 || this.velocity.y !==0) {
      this.preCheckPosition(
        this.position.x + this.velocity.x,
        this.position.y + this.velocity.y,
      );
    }
  }

  update(delta) {
    if (this.velocity.x !== 0 || this.velocity.y !==0) {
      this.setPosition(this.position.x, this.position.y);
    }
  }
}