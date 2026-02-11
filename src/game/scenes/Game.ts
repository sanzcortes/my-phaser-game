import { BaseScene } from "../../scenes/BaseScene";
import { Player } from "../../entities/Player";
import { createBackground } from "../components/background/Background";
import { setupCamera } from "../components/camera/Camera";
import { createCoinSprites } from "../components/collectables/Coin";
import { createPlatforms } from "../components/platforms/Platforms";
import { ASSETS } from "../constants";

export class Game extends BaseScene {

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Player;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    this.setupCamera();
    this.createBackground();
    this.createPlayer();
    this.createPlatforms();
    this.createCoins();
    this.setupInput();
    this.setupScoreDisplay();
    this.setupEventListeners();
  }

  update() {
    if (!this.player) return;
    this.player.update();
  }

  private setupCamera(): void {
    setupCamera.call(this);
  }

  private createBackground(): void {
    createBackground.call(this);
  }

  private createPlayer(): void {
    this.player = new Player(this, {
      x: 100,
      y: 440,
      assetKey: ASSETS.DUDE
    });
    this.physics.world.enable(this.player);
    this.add.existing(this.player);
    this.player.initialize();
  }

  private createPlatforms(): void {
    this.platforms = createPlatforms.call(this);
    this.physics.add.collider(this.player, this.platforms);
  }

  private createCoins(): void {
    createCoinSprites.call(this);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys();
    if (this.cursors) {
      this.player.setInputs(this.cursors);
    }
  }

  private setupScoreDisplay(): void {
    const currentScore = this.gameState.getScore();
    this.scoreText = this.add.text(16, 16, `score: ${currentScore}`);
  }

  protected setupEventListeners(): void {
    this.eventBus.on('scoreChanged', (score: number) => {
      this.scoreText.setText(`score: ${score}`);
    });

    this.eventBus.on('gameOver', () => {
      this.scene.start('GameOver');
    });

    super.setupEventListeners();
  }
}
