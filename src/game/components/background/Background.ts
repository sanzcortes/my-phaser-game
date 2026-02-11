import { ASSETS, WORLD } from "../../constants";

export function createBackground(this: any) {
  this.background = this.add.image(
    WORLD.CAMERA_X,
    WORLD.CAMERA_Y,
    ASSETS.BACKGROUND,
  );
  this.background.setAlpha(WORLD.BACKGROUND_ALPHA);
}
