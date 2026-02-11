export interface GameState {
  score: number;
  lives: number;
  level: number;
  isPaused: boolean;
  playerPosition: { x: number; y: number };
  collectedItems: string[];
  gameTime: number;
}

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;
  private eventBus: any;

  private constructor() {
    this.state = {
      score: 0,
      lives: 3,
      level: 1,
      isPaused: false,
      playerPosition: { x: 100, y: 440 },
      collectedItems: [],
      gameTime: 0
    };
    
    // Import EventBus lazily to avoid circular dependency
    import('./EventBus').then(({ EventBus }) => {
      this.eventBus = EventBus.getInstance();
    });
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public getScore(): number {
    return this.state.score;
  }

  public addScore(points: number): void {
    this.state.score += points;
    this.emit('scoreChanged', this.state.score);
  }

  public setScore(score: number): void {
    this.state.score = score;
    this.emit('scoreChanged', this.state.score);
  }

  public getLives(): number {
    return this.state.lives;
  }

  public loseLife(): void {
    this.state.lives = Math.max(0, this.state.lives - 1);
    this.emit('livesChanged', this.state.lives);
    
    if (this.state.lives === 0) {
      this.emit('gameOver');
    }
  }

  public addLife(): void {
    this.state.lives += 1;
    this.emit('livesChanged', this.state.lives);
  }

  public getLevel(): number {
    return this.state.level;
  }

  public nextLevel(): void {
    this.state.level += 1;
    this.emit('levelChanged', this.state.level);
  }

  public setLevel(level: number): void {
    this.state.level = level;
    this.emit('levelChanged', this.state.level);
  }

  public isPaused(): boolean {
    return this.state.isPaused;
  }

  public pause(): void {
    this.state.isPaused = true;
    this.emit('gamePaused');
  }

  public resume(): void {
    this.state.isPaused = false;
    this.emit('gameResumed');
  }

  public togglePause(): void {
    this.state.isPaused = !this.state.isPaused;
    this.emit(this.state.isPaused ? 'gamePaused' : 'gameResumed');
  }

  public getPlayerPosition(): { x: number; y: number } {
    return { ...this.state.playerPosition };
  }

  public setPlayerPosition(x: number, y: number): void {
    this.state.playerPosition = { x, y };
    this.emit('playerPositionChanged', this.state.playerPosition);
  }

  public getCollectedItems(): string[] {
    return [...this.state.collectedItems];
  }

  public collectItem(itemId: string): void {
    if (!this.state.collectedItems.includes(itemId)) {
      this.state.collectedItems.push(itemId);
      this.emit('itemCollected', itemId);
    }
  }

  public getGameTime(): number {
    return this.state.gameTime;
  }

  public setGameTime(time: number): void {
    this.state.gameTime = time;
    this.emit('gameTimeChanged', time);
  }

  public resetGame(): void {
    this.state = {
      score: 0,
      lives: 3,
      level: 1,
      isPaused: false,
      playerPosition: { x: 100, y: 440 },
      collectedItems: [],
      gameTime: 0
    };
    this.emit('gameReset');
  }

  public getFullState(): Readonly<GameState> {
    return { ...this.state };
  }

  private emit(event: string, data?: any): void {
    if (this.eventBus) {
      this.eventBus.emit(event, data);
    }
  }
}