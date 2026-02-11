export interface PlayerConfig {
  x: number;
  y: number;
  assetKey: string;
  bounce: number;
  accelerationX: number;
  jumpVelocity: number;
  jumpDownVelocity: number;
  gravityY: number;
}

export interface PlayerState {
  isJumping: boolean;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  currentVelocity: { x: number; y: number };
}