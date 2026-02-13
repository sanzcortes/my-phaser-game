export interface AssetEntry {
  key: string;
  path: string;
}

export interface SpritesheetEntry {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  endFrame?: number;
  margin?: number;
  spacing?: number;
}

export interface AudioEntry {
  key: string;
  path: string;
  instances?: number;
}

export interface AtlasEntry {
  key: string;
  path: string;
  atlasPath: string;
}

export interface MultiatlasEntry {
  key: string;
  path: string;
}

export interface AssetManifest {
  images: AssetEntry[];
  spritesheets: SpritesheetEntry[];
  audio: AudioEntry[];
  atlases?: AtlasEntry[];
  multiatlases?: MultiatlasEntry[];
}

export interface AssetLoadingProgress {
  percentage: number;
  loaded: number;
  total: number;
  currentFile: string;
}