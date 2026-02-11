// Asset names
export const ASSETS = {
  BACKGROUND: "background",
  DUDE: "dude",
  COIN: "coin",
  ENEMY: "enemy",
  PLATFORM: "platform",
} as const;

// Animation keys
export const ANIMATIONS = {
  LEFT: "left",
  RIGHT: "right",
  TURN: "turn",
} as const;

// Player settings
export const PLAYER = {
  START_X: 100,
  START_Y: 440,
  BOUNCE: 0.2,
  ACCELERATION_X: 160,
  JUMP_VELOCITY: -330,
  JUMP_DOWN_VELOCITY: 300,
  GRAVITY_Y: 300,
} as const;

// World settings
export const WORLD = {
  CAMERA_X: 512,
  CAMERA_Y: 384,
  BACKGROUND_ALPHA: 0.5,
  CAMERA_ZOOM: 2,
} as const;

// Sprite spawning
export const SPRITES = {
  COINS: {
    COUNT: 1,
    START_X: 180,
    START_Y: 400,
    SPACING: 64,
    SCALE: 0.5,
  },
  ENEMIES: {
    COUNT: 0,
    START_X: 180,
    START_Y: 500,
    SPACING: 64,
    SCALE: 0.5,
  },
} as const;

// Platform settings
export const PLATFORMS = {
  BASE: {
    X: 200,
    Y: 600,
    SCALE_X: 7,
    SCALE_Y: 3,
  },
  STEPS: {
    COUNT: 5,
    START_X: 150,
    START_Y: 550,
    STEP_X: 128,
    STEP_OFFSET_X: 100,
    STEP_FALL: 32,
    SCALE_X: 2,
    SCALE_Y: 1,
  },
} as const;

// Frame numbers for animations
export const ANIMATION_FRAMES = {
  LEFT_START: 0,
  LEFT_END: 3,
  TURN_FRAME: 4,
  RIGHT_START: 5,
  RIGHT_END: 8,
} as const;

// Gravity setting
export const gravity = 300;
