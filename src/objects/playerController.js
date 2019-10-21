import GameObject from "./gameObject";
import { log } from "../utils";

const MOVE_SPEED = 7;
const JUMP_FORCE = 13;
const GRAVITY_FORCE = 0.7;

export default class Player extends GameObject {
  constructor(width, height, texture, sourceHTMLElement, options, sceneRatio) {
    super(width, width, sourceHTMLElement, options);
    this.name = "player";

    // Use y ratio because scene height defines scene size.
    this.gravityForce = GRAVITY_FORCE * sceneRatio.y;
    this.moveSpeed = MOVE_SPEED * sceneRatio.y;
    this.jumpForce = JUMP_FORCE * sceneRatio.y;

    this.texture = texture;
    this.velocity.y = this.gravityForce;
    this.inJump = true;

    this.options = Object.assign({ hasHitbox: true }, this.options);

    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.keyDownHandler = this.handleKeyDown.bind(this);

    this.create2DObject();
    this.keyboardController();
  }

  create2DObject() {
    if (this.texture) {
      this.createSprite();
    } else {
      this.createGraphicsObject(3, 0x00);
    }
    this.object2d.position = this.position;
  }

  keyboardController() {
    window.addEventListener("keyup", this.keyUpHandler);
    window.addEventListener("keydown", this.keyDownHandler);
  }

  removeController() {
    window.removeEventListener("keyup", this.keyUpHandler);
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        if (GRAVITY_FORCE === 0) this.velocity.y = -this.moveSpeed;
        else if (!this.inJump) {
          this.velocity.y = -this.jumpForce;
          this.inJump = true;
        }
        break;
      case "ArrowDown":
        if (GRAVITY_FORCE === 0) this.velocity.y = this.moveSpeed;
        break;
      case "ArrowLeft":
        this.velocity.x = -this.moveSpeed;
        break;
      case "ArrowRight":
        this.velocity.x = this.moveSpeed;
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        if (GRAVITY_FORCE === 0) this.velocity.y = this.gravityForce;
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
   * @param {import("../typedef").Collision}
   * @memberof Player
   */
  onCollision({ other, axis }) {
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
    if (other.options.collectable) {
      log("Collected:", other.uuid);
    }
    if (other.options.isHazard) {
      log("Player died");
      this.removeController();
      this.velocity = { x: 0, y: 0 };
      this.destroy();
    }
  }

  beforeUpdate(delta) {
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.attemptMove(
        this.position.x + this.velocity.x,
        this.position.y + this.velocity.y
      );
      this.velocity.y += this.gravityForce;
    }
  }

  update(delta) {
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.setPosition(this.nextPosition.x, this.nextPosition.y);
    }
  }
}
