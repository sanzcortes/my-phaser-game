import { Scene } from "phaser";
import { createPlayer } from "../components/player/Player";
import { createBackground } from "../components/background/Background";
import { setupCamera } from "../components/camera/Camera";
import { createCoinSprites } from "../components/collectables/Coin";
import { createPlatforms } from "../components/platforms/Platforms";
import {
  handleDown,
  handleJump,
  handleJumpDown,
  handleLeftMovement,
  handleRightMovement,
  setupInput,
} from "../components/inputs/keyboardInputs";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Phaser.Physics.Arcade.Sprite;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  score: number = 0;
  scoreText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    setupCamera.call(this);
    createBackground.call(this);
    this.player = createPlayer.call(this);
    this.platforms = createPlatforms.call(this);
    createCoinSprites.call(this);
    setupInput.call(this);
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "score: 0");
  }

  update() {
    if (!this.cursors || !this.player || this.player.body === null) return;

    if (
      this.cursors.left.isDown &&
      this.cursors.up.isDown &&
      this.player.body.touching.down
    ) {
      handleLeftMovement.call(this);
      handleJump.call(this);
    }
    if (
      this.cursors.right.isDown &&
      this.cursors.up.isDown &&
      this.player.body.touching.down
    ) {
      handleRightMovement.call(this);
      handleJump.call(this);
    }
    if (this.cursors.left.isDown) {
      handleLeftMovement.call(this);
    }
    if (this.cursors.right.isDown) {
      handleRightMovement.call(this);
    }
    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      handleDown.call(this);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      handleJump.call(this);
    }
    if (this.player.body.touching.none && this.cursors.down.isDown) {
      handleJumpDown.call(this);
    }
  }
}
