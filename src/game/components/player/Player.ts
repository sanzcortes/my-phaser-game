import { ANIMATION_FRAMES, ANIMATIONS, ASSETS, PLAYER } from "../../constants";

export function createPlayer(this: any): Phaser.Physics.Arcade.Sprite {
  const player = this.physics.add.sprite(
    PLAYER.START_X,
    PLAYER.START_Y,
    ASSETS.DUDE,
  );
  player.setBounce(PLAYER.BOUNCE);
  player.setCollideWorldBounds(true);
  player.body!.setGravityY(PLAYER.GRAVITY_Y);
  createAnimations.call(this);
  return player;
}

export function createAnimations(this: any) {
  this.anims.create({
    key: ANIMATIONS.LEFT,
    frames: this.anims.generateFrameNumbers(ASSETS.DUDE, {
      start: ANIMATION_FRAMES.LEFT_START,
      end: ANIMATION_FRAMES.LEFT_END,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: ANIMATIONS.TURN,
    frames: [{ key: ASSETS.DUDE, frame: ANIMATION_FRAMES.TURN_FRAME }],
    frameRate: 20,
  });

  this.anims.create({
    key: ANIMATIONS.RIGHT,
    frames: this.anims.generateFrameNumbers(ASSETS.DUDE, {
      start: ANIMATION_FRAMES.RIGHT_START,
      end: ANIMATION_FRAMES.RIGHT_END,
    }),
    frameRate: 10,
    repeat: -1,
  });
}
