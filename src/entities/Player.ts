import { Physics } from 'phaser';
import { PlayerConfig, PlayerState } from './types/EntityTypes';
import { ANIMATIONS, ASSETS, ANIMATION_FRAMES } from '../game/constants';

export class Player extends Physics.Arcade.Sprite {
  private config: PlayerConfig;
  private playerState: PlayerState;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

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
      ...config
    };

    super(scene, defaultConfig.x, defaultConfig.y, defaultConfig.assetKey);
    
    this.config = defaultConfig;
    this.playerState = {
      isJumping: false,
      isMovingLeft: false,
      isMovingRight: false,
      currentVelocity: { x: 0, y: 0 }
    };
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

  public setInputs(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    this.cursors = cursors;
  }

  public update(): void {
    if (!this.cursors || !this.body) return;

    this.playerState.currentVelocity = { x: this.body.velocity.x, y: this.body.velocity.y };
    
    // Reset movement states
    this.playerState.isMovingLeft = false;
    this.playerState.isMovingRight = false;
    this.playerState.isJumping = !this.body.touching.down;

    // Handle input
    this.handleMovement();
    this.handleJump();
  }

  private handleMovement(): void {
    if (!this.cursors || !this.body) return;

    // Left movement with jump
    if (this.cursors.left.isDown && this.cursors.up.isDown && this.body.touching.down) {
      this.moveLeft();
      this.jump();
      return;
    }

    // Right movement with jump
    if (this.cursors.right.isDown && this.cursors.up.isDown && this.body.touching.down) {
      this.moveRight();
      this.jump();
      return;
    }

    // Left movement only
    if (this.cursors.left.isDown) {
      this.moveLeft();
      return;
    }

    // Right movement only
    if (this.cursors.right.isDown) {
      this.moveRight();
      return;
    }

    // Stop movement
    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.stopMoving();
    }
  }

  private handleJump(): void {
    if (!this.cursors || !this.body) return;

    // Jump only
    if (this.cursors.up.isDown && this.body.touching.down) {
      this.jump();
    }

    // Jump down when in air
    if (this.body.touching.none && this.cursors.down.isDown) {
      this.jumpDown();
    }
  }

  private moveLeft(): void {
    if (!this.body) return;

    this.playerState.isMovingLeft = true;

    if (this.body.velocity.x > 0) {
      this.setVelocityX(0);
      this.anims.play(ANIMATIONS.TURN, true);
    } else {
      this.setVelocityX(-this.config.accelerationX);
      this.anims.play(ANIMATIONS.LEFT, true);
    }
  }

  private moveRight(): void {
    if (!this.body) return;

    this.playerState.isMovingRight = true;

    if (this.body.velocity.x < 0) {
      this.setVelocityX(0);
      this.anims.play(ANIMATIONS.TURN, true);
    } else {
      this.setVelocityX(this.config.accelerationX);
      this.anims.play(ANIMATIONS.RIGHT, true);
    }
  }

  private stopMoving(): void {
    this.setVelocityX(0);
    this.anims.play(ANIMATIONS.TURN, true);
  }

  private jump(): void {
    this.setVelocityY(this.config.jumpVelocity);
  }

  private jumpDown(): void {
    this.setVelocityY(this.config.jumpDownVelocity);
  }

  public getState(): Readonly<PlayerState> {
    return { ...this.playerState };
  }

  public getConfig(): Readonly<PlayerConfig> {
    return { ...this.config };
  }
}