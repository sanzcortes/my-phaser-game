import { PlayerConfig } from '../entities/types/EntityTypes';
import { PhysicsConfig } from '../systems/types/PhysicsTypes';

export interface GameConfig {
  physics: PhysicsConfig;
  graphics: GraphicsConfig;
  audio: AudioConfig;
  gameplay: GameplayConfig;
}

export interface GraphicsConfig {
  width: number;
  height: number;
  backgroundColor: string;
  scaleMode: number;
  autoCenter: number;
}

export interface AudioConfig {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  enabled: boolean;
}

export interface GameplayConfig {
  playerConfig: Partial<PlayerConfig>;
  difficulty: 'easy' | 'normal' | 'hard';
  enableDebug: boolean;
  maxLives: number;
}

export interface EntityConfig {
  id: string;
  type: 'player' | 'enemy' | 'collectible' | 'platform' | 'background';
  position: { x: number; y: number };
  velocity?: { x: number; y: number };
  health?: number;
  active?: boolean;
}

export interface ComponentType {
  name: string;
  required: boolean;
  data?: any;
}

export interface EntityComponents {
  physics?: boolean;
  animation?: boolean;
  input?: boolean;
  collision?: boolean;
  render?: boolean;
}

export interface CollisionData {
  object1: Phaser.Types.Physics.Arcade.GameObjectWithBody;
  object2: Phaser.Types.Physics.Arcade.GameObjectWithBody;
  impactForce?: number;
  collisionNormal?: { x: number; y: number };
}

export interface AnimationData {
  key: string;
  frames: number[];
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
}

export interface InputBinding {
  action: string;
  keys: string[];
  gamepadButtons?: number[];
}

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  timePlayed: number;
  coinsCollected: number;
  enemiesDefeated: number;
  accuracy?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: {
    type: 'score' | 'level' | 'coins' | 'time' | 'custom';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface PowerUp {
  id: string;
  type: 'speed' | 'jump' | 'invincibility' | 'multiJump' | 'magnet';
  duration: number;
  effect: number;
  icon: string;
}

export interface LevelData {
  id: string;
  name: string;
  difficulty: number;
  requiredScore: number;
  timeLimit?: number;
  checkpoints?: { x: number; y: number }[];
  hazards?: EntityConfig[];
  collectibles?: EntityConfig[];
}

export interface ParticleConfig {
  texture: string;
  count: number;
  speed: { min: number; max: number };
  scale: { start: number; end: number };
  alpha: { start: number; end: number };
  lifespan: number;
  blendMode?: string;
  emitZone?: {
    type: 'edge' | 'random';
    source: any;
    quantity?: number;
  };
}

export interface CameraConfig {
  followOffset?: { x: number; y: number };
  zoom: number;
  bounds?: { x: number; y: number; width: number; height: number };
  lerp: { x: number; y: number };
  rotation: number;
}

export interface UIConfig {
  hud: {
    scorePosition: { x: number; y: number };
    livesPosition: { x: number; y: number };
    timePosition: { x: number; y: number };
  };
  menus: {
    backgroundColor: string;
    buttonStyle: {
      fontSize: string;
      fontFamily: string;
      color: string;
      hoverColor: string;
    };
  };
}

export interface SaveData {
  version: string;
  gameStats: GameStats;
  achievements: Achievement[];
  unlockedLevels: string[];
  currentLevel: string;
  lastPlayed: Date;
  settings: {
    audio: AudioConfig;
    graphics: GraphicsConfig;
    controls: InputBinding[];
  };
}

export interface DebugConfig {
  enabled: boolean;
  showFPS: boolean;
  showColliders: boolean;
  showGrid: boolean;
  showPositions: boolean;
  consoleLogLevel: 'debug' | 'info' | 'warn' | 'error';
}

export type GameEvent = 
  | 'gameStarted'
  | 'gamePaused'
  | 'gameResumed'
  | 'gameOver'
  | 'levelCompleted'
  | 'scoreChanged'
  | 'livesChanged'
  | 'coinCollected'
  | 'enemyDefeated'
  | 'powerUpCollected'
  | 'checkpointReached'
  | 'achievementUnlocked'
  | 'saveGame'
  | 'loadGame';