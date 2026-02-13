import { AssetManifest } from '../types/AssetTypes';

export const gameAssets: AssetManifest = {
  images: [
    { key: 'background', path: 'bg.png' },
    { key: 'logo', path: 'logo.png' },
    { key: 'platform', path: 'platform.png' },
    { key: 'enemy-bg', path: 'enemy-bg.png' },
    { key: 'coin-bg', path: 'coin-bg.png' },
    { key: 'enemy64-bg', path: 'enemy64-bg.png' }
  ],
  spritesheets: [
    {
      key: 'player',
      path: 'character.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'dude',
      path: 'dude.png',
      frameWidth: 32,
      frameHeight: 48
    },
    {
      key: 'coin',
      path: 'coin.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'coinGlowing',
      path: 'coinGlowing.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'coinsprite',
      path: 'coinsprite.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'enemy',
      path: 'enemy.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'enemy64',
      path: 'enemy64.png',
      frameWidth: 64,
      frameHeight: 64
    },
    {
      key: 'toto',
      path: 'toto.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'template9frames',
      path: 'template9frames.png',
      frameWidth: 32,
      frameHeight: 32
    },
    {
      key: 'character-withbg',
      path: 'character-withbg.png',
      frameWidth: 32,
      frameHeight: 32
    }
  ],
  audio: [
    // Add audio files here when available
  ]
};