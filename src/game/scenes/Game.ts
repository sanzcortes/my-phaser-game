import { BaseScene } from "../../scenes/BaseScene";
import { Player } from "../../entities/Player";
import { createBackground } from "../components/background/Background";
import { setupCamera } from "../components/camera/Camera";
import { createCoinSprites } from "../components/collectables/Coin";
import { createPlatforms } from "../components/platforms/Platforms";
import { InputSystem } from "../../systems/InputSystem";
import { AssetLoader } from "../../systems/AssetLoader";
import { gameAssets } from "../../systems/config/GameAssets";
import { ASSETS } from "../constants";

export class Game extends BaseScene {
  private player!: Player;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private scoreText: Phaser.GameObjects.Text;
  private inputSystem!: InputSystem;
  private assetLoader!: AssetLoader;

  constructor() {
    super("Game");
  }

  async create() {
    // Initialize systems
    this.initializeSystems();
    
    // Load assets
    await this.loadGameAssets();
    
    // Create game objects
    this.setupCamera();
    this.createBackground();
    this.createPlayer();
    this.createPlatforms();
    this.createCoins();
    this.setupScoreDisplay();
    this.setupEventListeners();
  }

  update() {
    if (!this.player) return;
    this.player.update();
  }

  private async loadGameAssets(): Promise<void> {
    try {
      await this.assetLoader.loadAssets(gameAssets);
    } catch (error) {
      this.showError(error as Error);
    }
  }

  private initializeSystems(): void {
    console.log('🎮 Game SCENE - INITIALIZE_SYSTEMS - Starting system initialization');
    this.inputSystem = new InputSystem(this);
    console.log('🎮 Game SCENE - INITIALIZE_SYSTEMS - InputSystem created');
    this.assetLoader = new AssetLoader(this);
    console.log('🎮 Game SCENE - INITIALIZE_SYSTEMS - All systems initialized');
  }

  private setupCamera(): void {
    setupCamera.call(this);
  }

  private createBackground(): void {
    createBackground.call(this);
  }

  private createPlayer(): void {
    console.log('🦸 Game SCENE - CREATE_PLAYER - Creating player');
    this.player = new Player(this, {
      x: 100,
      y: 440,
      assetKey: ASSETS.DUDE
    });
    this.add.existing(this.player);
    this.player.initialize();
    console.log('🦸 Game SCENE - CREATE_PLAYER - Player initialized, setting inputs');
    this.player.setInputs(this.inputSystem);
    console.log('🦸 Game SCENE - CREATE_PLAYER - InputSystem set on player');
  }

  private createPlatforms(): void {
    this.platforms = createPlatforms.call(this);
    this.physics.add.collider(this.player, this.platforms);
  }

  private createCoins(): void {
    createCoinSprites.call(this);
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

    this.eventBus.on('keyChanged', (data: any) => {
      // Handle global key changes if needed
      this.log(`Key ${data.key} ${data.isDown ? 'pressed' : 'released'}`);
    });

    super.setupEventListeners();
  }
}