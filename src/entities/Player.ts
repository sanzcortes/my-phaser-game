import { Physics } from "phaser";
import { PlayerConfig, PlayerState } from "./types/EntityTypes";
import { ANIMATIONS, ASSETS, ANIMATION_FRAMES } from "../game/constants";
import { InputSystem } from "../systems/InputSystem";

export class Player extends Physics.Arcade.Sprite {
  private config: PlayerConfig;
  private playerState: PlayerState;
  private inputSystem?: InputSystem;

  constructor(scene: Phaser.Scene, config: Partial<PlayerConfig> = {}) {
    const defaultConfig: PlayerConfig = {
      x: 100,
      y: 440,
      assetKey: ASSETS.DUDE,
      bounce: 0.2,
      accelerationX: 160,
      jumpVelocity: -330,
      jumpDownVelocity: 300,
      gravityY: 300,
      ...config,
    };

    super(scene, defaultConfig.x, defaultConfig.y, defaultConfig.assetKey);

    this.config = defaultConfig;
    this.playerState = {
      isJumping: false,
      isMovingLeft: false,
      isMovingRight: false,
      currentVelocity: { x: 0, y: 0 },
    };

    scene.physics.world.enable(this);
  }

  public initialize(): void {
    this.setupAnimations();
    this.setupPhysics();
    this.setProperties();
  }

  private setProperties(): void {
    this.setBounce(this.config.bounce);
    this.setCollideWorldBounds(true);
  }

  private setupPhysics(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body && body.setGravityY) {
      body.setGravityY(this.config.gravityY);
    }
  }

  private setupAnimations(): void {
    const scene = this.scene;

    scene.anims.create({
      key: ANIMATIONS.LEFT,
      frames: scene.anims.generateFrameNumbers(ASSETS.DUDE, {
        start: ANIMATION_FRAMES.LEFT_START,
        end: ANIMATION_FRAMES.LEFT_END,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: ANIMATIONS.TURN,
      frames: [{ key: ASSETS.DUDE, frame: ANIMATION_FRAMES.TURN_FRAME }],
      frameRate: 20,
    });

    scene.anims.create({
      key: ANIMATIONS.RIGHT,
      frames: scene.anims.generateFrameNumbers(ASSETS.DUDE, {
        start: ANIMATION_FRAMES.RIGHT_START,
        end: ANIMATION_FRAMES.RIGHT_END,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  public setInputs(inputSystem: InputSystem): void {
    console.log("🎯 Player SET_INPUTS - Setting InputSystem on player");
    this.inputSystem = inputSystem;
    console.log("🎯 Player SET_INPUTS - InputSystem reference stored");
  }

  public update(): void {
    console.log("🎯 Player UPDATE - Player update called");
    if (!this.inputSystem) {
      console.log("🎯 Player UPDATE - No InputSystem, returning");
      return;
    }
    if (!this.body) {
      console.log("🎯 Player UPDATE - No body, returning");
      return;
    }

    this.playerState.currentVelocity = {
      x: this.body.velocity.x,
      y: this.body.velocity.y,
    };

    // Reset movement states
    this.playerState.isMovingLeft = false;
    this.playerState.isMovingRight = false;
    this.playerState.isJumping = !this.body.touching.down;

    console.log("🎯 Player UPDATE - About to handle movement");
    // Handle input
    this.handleMovement();
    this.handleJump();
  }

  private handleMovement(): void {
    console.log("🎯 Player HANDLE_MOVEMENT - Starting movement handling");
    if (!this.inputSystem || !this.body) {
      console.log(
        "🎯 Player HANDLE_MOVEMENT - Missing InputSystem or body, returning",
      );
      return;
    }

    const leftPressed = this.inputSystem.isPressed("left");
    const rightPressed = this.inputSystem.isPressed("right");
    const upPressed = this.inputSystem.isPressed("up");

    console.log("🎯 Player HANDLE_MOVEMENT - Input states:", {
      left: leftPressed,
      right: rightPressed,
      up: upPressed,
    });

    // Left movement with jump
    if (leftPressed && upPressed && this.body.touching.down) {
      console.log("🎯 Player HANDLE_MOVEMENT - Left + Jump detected");
      this.moveLeft();
      this.jump();
      return;
    }

    // Right movement with jump
    if (rightPressed && upPressed && this.body.touching.down) {
      console.log("🎯 Player HANDLE_MOVEMENT - Right + Jump detected");
      this.moveRight();
      this.jump();
      return;
    }

    // Left movement only
    if (leftPressed) {
      console.log("🎯 Player HANDLE_MOVEMENT - Left movement detected");
      this.moveLeft();
      return;
    }

    // Right movement only
    if (rightPressed) {
      console.log("🎯 Player HANDLE_MOVEMENT - Right movement detected");
      this.moveRight();
      return;
    }

    // Stop movement
    if (!leftPressed && !rightPressed) {
      console.log("🎯 Player HANDLE_MOVEMENT - Stop movement detected");
      this.stopMoving();
    }
  }

  private handleJump(): void {
    if (!this.inputSystem || !this.body) return;

    // Jump only - use justPressed for better responsiveness
    if (this.inputSystem.justPressed("up") && this.body.touching.down) {
      this.jump();
    }

    // Jump down when in air
    if (this.body.touching.none && this.inputSystem.isPressed("down")) {
      this.jumpDown();
    }
  }

  private moveLeft(): void {
    console.log("🏃 Player MOVE_LEFT - Moving left");
    if (!this.body) return;

    this.playerState.isMovingLeft = true;

    if (this.body.velocity.x > 0) {
      this.setVelocityX(0);
      this.anims.play(ANIMATIONS.TURN, true);
    } else {
      this.setVelocityX(-this.config.accelerationX);
      this.anims.play(ANIMATIONS.LEFT, true);
    }
    console.log("🏃 Player MOVE_LEFT - Velocity set to:", this.body.velocity.x);
  }

  private moveRight(): void {
    console.log("🏃 Player MOVE_RIGHT - Moving right");
    if (!this.body) return;

    this.playerState.isMovingRight = true;

    if (this.body.velocity.x < 0) {
      this.setVelocityX(0);
      this.anims.play(ANIMATIONS.TURN, true);
    } else {
      this.setVelocityX(this.config.accelerationX);
      this.anims.play(ANIMATIONS.RIGHT, true);
    }
    console.log(
      "🏃 Player MOVE_RIGHT - Velocity set to:",
      this.body.velocity.x,
    );
  }

  private stopMoving(): void {
    console.log("🛑 Player STOP_MOVING - Stopping movement");
    this.setVelocityX(0);
    this.anims.play(ANIMATIONS.TURN, true);
    console.log(
      "🛑 Player STOP_MOVING - Velocity set to:",
      this.body.velocity.x,
    );
  }

  private jump(): void {
    console.log("🦘 Player JUMP - Jumping");
    this.setVelocityY(this.config.jumpVelocity);
  }

  private jumpDown(): void {
    console.log("🔽 Player JUMP_DOWN - Jumping down");
    this.setVelocityY(this.config.jumpDownVelocity);
  }

  public getState(): Readonly<PlayerState> {
    return { ...this.playerState };
  }

  public getConfig(): Readonly<PlayerConfig> {
    return { ...this.config };
  }
}
