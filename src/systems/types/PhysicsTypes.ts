export interface CollisionConfig {
  overlapOnly?: boolean;
  callback?: (obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) => void;
  processCallback?: (obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) => boolean;
}

export interface PhysicsConfig {
  gravity: { x: number; y: number };
  debug: boolean;
  maxCollisions?: number;
  enableSpatialGrid?: boolean;
}

export interface CollisionPair {
  object1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  object2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  config: CollisionConfig;
}