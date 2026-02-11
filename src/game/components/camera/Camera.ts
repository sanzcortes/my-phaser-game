import { WORLD } from "../../constants";

export function setupCamera(this: any) {
  this.camera = this.cameras.main;
  this.camera.setBackgroundColor(0x00ff00);
  this.camera.scaleManager.setZoom(WORLD.CAMERA_ZOOM);
}
