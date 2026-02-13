import { PhysicsConfig } from './types/PhysicsTypes';
import { EventBus } from '../core/EventBus';

export class PhysicsSystem {
  private scene: Phaser.Scene;
  private physics: Phaser.Physics.Arcade.ArcadePhysics;
  private config: PhysicsConfig;
  private eventBus: EventBus;
  private enabled: boolean = true;

  constructor(scene: Phaser.Scene, config: Partial<PhysicsConfig> = {}) {
    this.scene = scene;
    this.physics = scene.physics;
    this.eventBus = EventBus.getInstance();
    
    this.config = {
      gravity: { x: 0, y: 300 },
      debug: false,
      maxCollisions: 50,
      enableSpatialGrid: true,
      ...config
    };

    this.initialize();
  }

  private initialize(): void {
    this.physics.world.gravity.set(this.config.gravity.x, this.config.gravity.y);
    
    if (this.config.debug) {
      this.physics.world.createDebugGraphic();
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('gamePaused', () => {
      this.pause();
    });

    this.eventBus.on('gameResumed', () => {
      this.resume();
    });

    this.scene.events.on('update', () => {
      this.update();
    });
  }

  public update(): void {
    if (!this.enabled) return;
    
    this.eventBus.emit('physicsUpdate', { 
      bodies: this.physics.world.bodies.size 
    });
  }

  public addCollider(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    callback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
    processCallback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
  ): Phaser.Physics.Arcade.Collider {
    return this.physics.add.collider(object1, object2, callback, processCallback);
  }

  public addOverlap(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    callback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
    processCallback?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
  ): Phaser.Physics.Arcade.Collider {
    return this.physics.add.overlap(object1, object2, callback, processCallback);
  }

  public setGravity(x: number, y?: number): void {
    const newY = y !== undefined ? y : this.config.gravity.y;
    this.config.gravity = { x, y: newY };
    this.physics.world.gravity.set(x, newY);
    
    this.eventBus.emit('gravityChanged', { x, y: newY });
  }

  public getGravity(): { x: number; y: number } {
    return { ...this.config.gravity };
  }

  public enableDebug(enabled: boolean = true): void {
    this.config.debug = enabled;
    
    if (enabled) {
      this.physics.world.createDebugGraphic();
    } else {
      if (this.physics.world.debugGraphic) {
        this.physics.world.debugGraphic.destroy();
      }
    }
  }

  public pause(): void {
    this.enabled = false;
    this.physics.world.pause();
    this.eventBus.emit('physicsPaused');
  }

  public resume(): void {
    this.enabled = true;
    this.physics.world.resume();
    this.eventBus.emit('physicsResumed');
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setWorldBounds(
    x: number = 0,
    y: number = 0,
    width: number = this.physics.world.bounds.width,
    height: number = this.physics.world.bounds.height
  ): void {
    this.physics.world.setBounds(x, y, width, height);
    this.eventBus.emit('worldBoundsChanged', { x, y, width, height });
  }

  public getWorldBounds(): Phaser.Geom.Rectangle {
    const bounds = this.physics.world.bounds;
    return new Phaser.Geom.Rectangle(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );
  }

  public createStaticGroup(): Phaser.Physics.Arcade.StaticGroup {
    return this.physics.add.staticGroup();
  }

  public createGroup(): Phaser.Physics.Arcade.Group {
    return this.physics.add.group();
  }

  public enableBody(
    object: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    this.physics.world.enable(object);
  }

  public destroy(): void {
    if (this.physics.world.debugGraphic) {
      this.physics.world.debugGraphic.destroy();
    }
  }
}