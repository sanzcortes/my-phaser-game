import { ANIMATIONS, PLAYER } from "../../constants";

export function setupInput(this: any) {
  this.cursors = this.input.keyboard?.createCursorKeys();
}

export function handleLeftMovement(this: any) {
  const body = this.player.body!;
  if (body.velocity.x > 0) {
    this.player.setVelocityX(0);
    this.player.anims.play(ANIMATIONS.TURN, true);
  } else {
    this.player.setVelocityX(-PLAYER.ACCELERATION_X);
    this.player.anims.play(ANIMATIONS.LEFT, true);
  }
}

export function handleRightMovement(this: any) {
  const body = this.player.body!;
  if (body.velocity.x < 0) {
    this.player.setVelocityX(0);
    this.player.anims.play(ANIMATIONS.TURN, true);
  } else {
    this.player.setVelocityX(PLAYER.ACCELERATION_X);
    this.player.anims.play(ANIMATIONS.RIGHT, true);
  }
}

export function handleJump(this: any) {
  this.player.setVelocityY(PLAYER.JUMP_VELOCITY);
}

export function handleJumpDown(this: any) {
  this.player.setVelocityY(PLAYER.JUMP_DOWN_VELOCITY);
}

export function handleDown(this: any) {
  this.player.setVelocityX(0);
  this.player.anims.play(ANIMATIONS.TURN, true);
}
