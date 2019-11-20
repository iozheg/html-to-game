const CAMERA_MAX_OFFSET = 0;

export default class Camera {
  constructor(sceneSize, target) {
    this.target = target;
    this.sceneSize = sceneSize;
    /** Limits for camera moving. */
    this.cameraLimits = {
      top: CAMERA_MAX_OFFSET,
      right: sceneSize.width - CAMERA_MAX_OFFSET,
      bottom: sceneSize.height - CAMERA_MAX_OFFSET,
      left: CAMERA_MAX_OFFSET,
    };

    this.constantPosition = {};
  }

  setCameraPosition(stage) {
    let basePosition = { x: 0, y: 0 };
    if (this.target) {
      basePosition = this.target.position;
    }

    const x = this.constantPosition.x || Math.min(
      Math.max(basePosition.x, this.cameraLimits.left),
      this.cameraLimits.right
    );
    const y = this.constantPosition.y || Math.min(
      Math.max(basePosition.y, this.cameraLimits.top),
      this.cameraLimits.bottom
    );

    stage.pivot.x = x;
    stage.pivot.y = y;
  }

  setTarget(target) {
    this.target = target;
  }

  setLimits(renderer) {
    this.cameraLimits = {
      top: renderer.height / 2,
      right: this.sceneSize.width - renderer.width / 2,
      bottom: this.sceneSize.height - renderer.height / 2,
      left: renderer.width / 2,
    };

    /* Fix axis if scene less than viewport. */
    if (this.sceneSize.width <= renderer.width ) {
      this.constantPosition.x = this.sceneSize.width / 2;
    }
    if (this.sceneSize.height <= renderer.height ) {
      this.constantPosition.y = this.sceneSize.height / 2;
    }
  }

  destroy() {
    this.target = undefined;
  }
}