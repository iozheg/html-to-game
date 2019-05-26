const CAMERA_MAX_OFFSET = 400;

export default class Camera {
  constructor(sceneSize, target) {
    this.target = target;
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
}