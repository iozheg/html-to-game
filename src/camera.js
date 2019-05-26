const CAMERA_MAX_OFFSET = 0;

export default class Camera {
  constructor(sceneSize, target) {
    this.target = target;
    this.sceneSize = sceneSize;
    this.cameraLimits = {
      top: CAMERA_MAX_OFFSET,
      right: sceneSize.width - CAMERA_MAX_OFFSET,
      bottom: sceneSize.height - CAMERA_MAX_OFFSET,
      left: CAMERA_MAX_OFFSET,
    };
  }

  setCameraPosition(stage) {
    let basePosition = { x: 0, y: 0 };
    if (this.target) {
      basePosition = this.target.position;
    }

    const x = Math.min(
      Math.max(basePosition.x, this.cameraLimits.left),
      this.cameraLimits.right
    );
    const y = Math.min(
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
  }
}