import { ASSETS, SPRITES } from "../../constants";

export function collectCoin(
  _player: any,
  coin: { disableBody: (arg0: boolean, arg1: boolean) => void },
) {
  coin.disableBody(true, true);
}

export function onCollectCoin(
  this: any,
  _player: any,
  coin: { x: number; y: number },
) {
  //display text +1
  const msg = this.add.text(coin.x, coin.y, "+1", {
    fontSize: "16px",
    fill: "#000000",
  });
  this.tweens.add({
    targets: msg,
    y: coin.y - 50,
    alpha: 0,
    duration: 800,
    ease: "Power1",
    onComplete: () => {
      msg.destroy();
    },
  });
  // You can add score increment or sound effects here
  this.score += 1;
  this.scoreText.setText("score: " + this.score);
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
  coins.children.iterate((child) => {
    (child as Phaser.Physics.Arcade.Sprite).setBounceY(
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
