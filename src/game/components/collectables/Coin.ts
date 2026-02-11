import { ASSETS, SPRITES } from "../../constants";

export function collectCoin(
  _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  coin: Phaser.Types.Physics.Arcade.GameObjectWithBody,
) {
  const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
  coinSprite.disableBody(true, true);
}

export function onCollectCoin(
  this: any,
  _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  coin: Phaser.Types.Physics.Arcade.GameObjectWithBody,
) {
  const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
  
  //display text +1
  const msg = this.add.text(coinSprite.x, coinSprite.y, "+1", {
    fontSize: "16px",
    fill: "#000000",
  });
  this.tweens.add({
    targets: msg,
    y: coinSprite.y - 50,
    alpha: 0,
    duration: 800,
    ease: "Power1",
    onComplete: () => {
      msg.destroy();
    },
  });
  
  // Use GameStateManager to track score
  import("../../../core/GameStateManager").then(({ GameStateManager }) => {
    const gameState = GameStateManager.getInstance();
    gameState.addScore(1);
    
    // Emit coin collected event
    import("../../../core/EventBus").then(({ EventBus }) => {
      const eventBus = EventBus.getInstance();
      eventBus.emit('coinCollected', { x: coinSprite.x, y: coinSprite.y, value: 1 });
    });
  });
}

export function createCoinSprites(this: any) {
  const coins = this.physics.add.group({
    key: ASSETS.COIN,
    repeat: SPRITES.COINS.COUNT - 1,
    setXY: {
      x: SPRITES.COINS.START_X,
      y: SPRITES.COINS.START_Y,
      stepX: SPRITES.COINS.SPACING,
    },
  });
  coins.children.iterate((child: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
    const childSprite = child as Phaser.Physics.Arcade.Sprite;
    childSprite.setBounceY(
      Phaser.Math.FloatBetween(0.4, 0.8),
    );
  });
  this.physics.add.collider(coins, this.platforms);
  this.physics.add.overlap(
    this.player,
    coins,
    (_player, coin) => collectCoin(_player, coin),
    (_player, coin) => onCollectCoin.call(this, _player, coin),
    this,
  );
}
