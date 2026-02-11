import { Scene } from 'phaser';
import { EventBus } from '../core/EventBus';
import { GameStateManager } from '../core/GameStateManager';

export abstract class BaseScene extends Scene {
  protected eventBus: EventBus;
  protected gameState: GameStateManager;
  protected sceneName: string;

  constructor(key: string) {
    super(key);
    this.sceneName = key;
  }

  init(): void {
    this.eventBus = EventBus.getInstance();
    this.gameState = GameStateManager.getInstance();
    this.setupEventListeners();
  }

  protected setupEventListeners(): void {
    // Override in subclasses to set up scene-specific listeners
  }

  protected showError(error: Error): void {
    console.error(`[${this.sceneName}] Error:`, error);
    // Could show error UI here in the future
  }

  protected log(message: string, data?: any): void {
    if (data) {
      console.log(`[${this.sceneName}] ${message}:`, data);
    } else {
      console.log(`[${this.sceneName}] ${message}`);
    }
  }

  protected cleanup(): void {
    // Override in subclasses to clean up resources
    this.eventBus.clear();
  }

  remove(): void {
    this.cleanup();
  }
}