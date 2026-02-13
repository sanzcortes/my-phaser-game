export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  space: boolean;
  shift: boolean;
  mouseX: number;
  mouseY: number;
  pointerDown: boolean;
}

export interface InputBindings {
  left: string[];
  right: string[];
  up: string[];
  down: string[];
  jump: string[];
  action: string[];
}

export interface InputConfig {
  enableKeyboard: boolean;
  enablePointer: boolean;
  enableGamepad: boolean;
  bindings?: Partial<InputBindings>;
}