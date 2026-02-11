import { ASSETS, PLATFORMS } from "../../constants";

export function createPlatforms(this: any): Phaser.Physics.Arcade.StaticGroup {
  const platforms = this.physics.add.staticGroup();
  // Base platform
  platforms
    .create(PLATFORMS.BASE.X, PLATFORMS.BASE.Y, ASSETS.PLATFORM)
    .setScale(PLATFORMS.BASE.SCALE_X, PLATFORMS.BASE.SCALE_Y)
    .refreshBody();

  // Platform stairs
  for (let i = 0; i < PLATFORMS.STEPS.COUNT; i++) {
    platforms
      .create(
        PLATFORMS.STEPS.START_X +
          i * PLATFORMS.STEPS.STEP_X +
          PLATFORMS.STEPS.STEP_OFFSET_X * i,
        PLATFORMS.STEPS.START_Y - i * PLATFORMS.STEPS.STEP_FALL,
        ASSETS.PLATFORM,
      )
      .setScale(PLATFORMS.STEPS.SCALE_X, PLATFORMS.STEPS.SCALE_Y)
      .refreshBody();
  }

  return platforms;
}
