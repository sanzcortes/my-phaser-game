import { AssetManifest, AssetLoadingProgress, AssetEntry, SpritesheetEntry, AudioEntry, AtlasEntry, MultiatlasEntry } from './types/AssetTypes';
import { EventBus } from '../core/EventBus';

export class AssetLoader {
  private scene: Phaser.Scene;
  private eventBus: EventBus;
  private loadedAssets: Set<string> = new Set();
  private isLoading: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.eventBus = EventBus.getInstance();
  }

  public async loadAssets(manifest: AssetManifest): Promise<void> {
    if (this.isLoading) {
      throw new Error('Asset loading already in progress');
    }

    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.setupProgressTracking(resolve, reject);
      
      try {
        this.loadImages(manifest.images);
        this.loadSpritesheets(manifest.spritesheets);
        this.loadAudio(manifest.audio);
        
        if (manifest.atlases) {
          this.loadAtlases(manifest.atlases);
        }
        
        if (manifest.multiatlases) {
          this.loadMultiatlases(manifest.multiatlases);
        }

        this.scene.load.start();
      } catch (error) {
        this.isLoading = false;
        reject(error);
      }
    });
  }

  private setupProgressTracking(
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    // Track overall progress
    this.scene.load.on('progress', (progress: number) => {
      const progressData: AssetLoadingProgress = {
        percentage: Math.round(progress * 100),
        loaded: Math.round(progress * this.getTotalAssets()),
        total: this.getTotalAssets(),
        currentFile: this.getCurrentLoadingFile()
      };
      
      this.eventBus.emit('assetLoadingProgress', progressData);
    });

    // Handle completion
    this.scene.load.on('complete', () => {
      this.isLoading = false;
      this.cacheLoadedAssets();
      this.eventBus.emit('assetsLoaded');
      resolve();
    });

    // Handle errors
    this.scene.load.on('loaderror', (file: Phaser.Loader.File) => {
      const error = new Error(`Failed to load asset: ${file.key} (${file.url})`);
      this.isLoading = false;
      this.eventBus.emit('assetLoadingError', { file, error });
      reject(error);
    });
  }

  private loadImages(images: AssetEntry[]): void {
    images.forEach(image => {
      if (!this.isAssetLoaded(image.key)) {
        this.scene.load.image(image.key, `assets/${image.path}`);
      }
    });
  }

  private loadSpritesheets(spritesheets: SpritesheetEntry[]): void {
    spritesheets.forEach(spritesheet => {
      if (!this.isAssetLoaded(spritesheet.key)) {
        this.scene.load.spritesheet({
          key: spritesheet.key,
          url: `assets/${spritesheet.path}`,
          frameConfig: {
            frameWidth: spritesheet.frameWidth,
            frameHeight: spritesheet.frameHeight,
            endFrame: spritesheet.endFrame,
            margin: spritesheet.margin,
            spacing: spritesheet.spacing
          }
        });
      }
    });
  }

  private loadAudio(audio: AudioEntry[]): void {
    audio.forEach(audioFile => {
      if (!this.isAssetLoaded(audioFile.key)) {
        this.scene.load.audio(audioFile.key, `assets/${audioFile.path}`);
      }
    });
  }

  private loadAtlases(atlases: AtlasEntry[]): void {
    atlases.forEach(atlas => {
      if (!this.isAssetLoaded(atlas.key)) {
        this.scene.load.atlas({
          key: atlas.key,
          textureURL: `assets/${atlas.path}`,
          atlasURL: `assets/${atlas.atlasPath}`
        });
      }
    });
  }

  private loadMultiatlases(multiatlases: MultiatlasEntry[]): void {
    multiatlases.forEach(multiatlas => {
      if (!this.isAssetLoaded(multiatlas.key)) {
        this.scene.load.multiatlas(multiatlas.key, `assets/${multiatlas.path}`);
      }
    });
  }

  private cacheLoadedAssets(): void {
    // Mark assets as loaded when loading completes
    // This will be called in the complete event
  }

  private isAssetLoaded(key: string): boolean {
    return this.loadedAssets.has(key);
  }

  private getTotalAssets(): number {
    return this.scene.load.list.size;
  }

  private getCurrentLoadingFile(): string {
    // Simplified approach - return empty string for now
    return '';
  }

  public preloadAsset(key: string, url: string, type: 'image' | 'audio' = 'image'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isAssetLoaded(key)) {
        resolve();
        return;
      }

      this.scene.load.on(`filecomplete-${type}-${key}`, () => {
        this.loadedAssets.add(key);
        resolve();
      });

      this.scene.load.on('loaderror', (file: Phaser.Loader.File) => {
        if (file.key === key) {
          reject(new Error(`Failed to load ${key}: ${file.url}`));
        }
      });

      if (type === 'image') {
        this.scene.load.image(key, url);
      } else if (type === 'audio') {
        this.scene.load.audio(key, url);
      }

      this.scene.load.start();
    });
  }

  public unloadAsset(key: string): void {
    // Simplified - just remove from our tracking
    this.loadedAssets.delete(key);
    this.eventBus.emit('assetUnloaded', { key });
  }

  public isLoaded(key: string): boolean {
    return this.isAssetLoaded(key);
  }

  public getLoadedAssets(): string[] {
    return Array.from(this.loadedAssets);
  }

  public getLoadingProgress(): AssetLoadingProgress {
    const total = this.scene.load.list.size;
    const percentage = 0; // Simplified for now

    return {
      percentage,
      loaded: 0,
      total,
      currentFile: this.getCurrentLoadingFile()
    };
  }

  public destroy(): void {
    this.scene.load.removeAllListeners();
    this.loadedAssets.clear();
  }
}