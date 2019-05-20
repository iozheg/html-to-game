import * as PIXI from "pixi.js";
import GameObject from "./gameObject";
import { log } from "./utils";

const MOVE_SPEED = 5;
const JUMP_FORCE = 6;
const GRAVITY_FORCE = 0.2;

export default class Player extends GameObject {
  constructor(width, height) {
    super(width, width);

    this.hasHitbox = true;
    this.velocity.y = GRAVITY_FORCE;
    this.inJump = true;

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
        if (GRAVITY_FORCE === 0) this.velocity.y = -MOVE_SPEED;
        else if (!this.inJump) {
          this.velocity.y = -JUMP_FORCE;
          this.inJump = true;
        }
        break;
      case "ArrowDown":
        if (GRAVITY_FORCE === 0) this.velocity.y = MOVE_SPEED;
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
        if (GRAVITY_FORCE === 0) this.velocity.y = GRAVITY_FORCE;
        break;
      case "ArrowLeft":
        if (this.velocity.x < 0) this.velocity.x = 0;
        break;
      case "ArrowRight":
        if (this.velocity.x > 0) this.velocity.x = 0;
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
    /* Find out side of collision for each axis and set object near. */
    if (axis.x !== 0) {
      if (this.position.x > other.position.x + other.width) {
        this.position.x = other.position.x + other.width + 1;
      } else if (this.position.x + this.width < other.position.x) {
        this.position.x = other.position.x - this.width - 1;
      }
      this.nextPosition.x = this.position.x;
    }

    if (axis.y !== 0) {
      if (this.position.y > other.position.y + other.height) {
        this.position.y = other.position.y + other.height + 1;
        if (GRAVITY_FORCE !== 0) this.velocity.y = 0.1;
      } else if (this.position.y + this.height < other.position.y) {
        this.position.y = other.position.y - this.width - 1;
        /* Jump is finished if object fell on from the top. */
        this.inJump = false;
        if (GRAVITY_FORCE !== 0) this.velocity.y = 0;
      }
      this.nextPosition.y = this.position.y;
    }
  }

  /**
   * @param {GameObject} other
   * @memberof Player
   */
  onTrigger(other) {
    if (other.isCollectable) {
      log("Collected:", other.uuid);
    }
  }

  beforeUpdate(delta) {
    if (this.velocity.x !== 0 || this.velocity.y !==0) {
      this.attemptMove(
        this.position.x + this.velocity.x,
        this.position.y + this.velocity.y
      );
      this.velocity.y += GRAVITY_FORCE;
    }
  }

  update(delta) {
    if (this.velocity.x !== 0 || this.velocity.y !==0) {
      this.setPosition(this.nextPosition.x, this.nextPosition.y);
    }
  }
}