import { InputState, InputConfig } from "./types/InputTypes";
import { EventBus } from "../core/EventBus";

export class InputSystem {
  private scene: Phaser.Scene;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Map<string, Phaser.Input.Keyboard.Key> = new Map();
  private state: InputState;
  private config: InputConfig;
  private eventBus: EventBus;
  private previousState: InputState;
  private enabled: boolean = true;

  constructor(
    scene: Phaser.Scene,
    config: InputConfig = {
      enableKeyboard: true,
      enablePointer: true,
      enableGamepad: false,
    },
  ) {
    console.log("🔧 InputSystem CONSTRUCTOR - Starting initialization");
    this.scene = scene;
    this.config = config;
    this.eventBus = EventBus.getInstance();

    this.state = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      shift: false,
      mouseX: 0,
      mouseY: 0,
      pointerDown: false,
    };

    this.previousState = { ...this.state };

    console.log("🔧 InputSystem CONSTRUCTOR - About to initialize");
    this.initialize();
    console.log("🔧 InputSystem CONSTRUCTOR - Initialization complete");
  }

  private initialize(): void {
    if (this.config.enableKeyboard) {
      this.setupKeyboard();
    }

    if (this.config.enablePointer) {
      this.setupPointer();
    }

    if (this.config.enableGamepad) {
      this.setupGamepad();
    }

    this.setupEventListeners();
  }

  private setupKeyboard(): void {
    console.log("⌨️ InputSystem SETUP_KEYBOARD - Starting keyboard setup");

    // Setup cursor keys
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    console.log(
      "⌨️ InputSystem SETUP_KEYBOARD - Cursors created:",
      !!this.cursors,
    );

    // Setup additional keys
    const keyMap = {
      SPACE: "space",
      SHIFT: "shift",
      A: "left",
      D: "right",
      W: "up",
      S: "down",
    };

    Object.entries(keyMap).forEach(([phaserKey, stateKey]) => {
      const key = this.scene.input.keyboard?.addKey(phaserKey);
      if (key) {
        this.keys.set(stateKey, key);
        console.log(
          `⌨️ InputSystem SETUP_KEYBOARD - Key ${phaserKey} -> ${stateKey} mapped`,
        );
      }
    });

    console.log("⌨️ InputSystem SETUP_KEYBOARD - Keyboard setup complete");
  }

  private setupPointer(): void {
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.state.pointerDown = true;
      this.state.mouseX = pointer.x;
      this.state.mouseY = pointer.y;
      this.eventBus.emit("pointerDown", { x: pointer.x, y: pointer.y });
    });

    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.state.pointerDown = false;
      this.state.mouseX = pointer.x;
      this.state.mouseY = pointer.y;
      this.eventBus.emit("pointerUp", { x: pointer.x, y: pointer.y });
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.state.mouseX = pointer.x;
      this.state.mouseY = pointer.y;
      this.eventBus.emit("pointerMove", { x: pointer.x, y: pointer.y });
    });
  }

  private setupGamepad(): void {
    this.scene.input.gamepad?.on(
      "down",
      (
        pad: Phaser.Input.Gamepad.Gamepad,
        button: Phaser.Input.Gamepad.Button,
      ) => {
        this.eventBus.emit("gamepadDown", { pad, button });
      },
    );

    this.scene.input.gamepad?.on(
      "up",
      (
        pad: Phaser.Input.Gamepad.Gamepad,
        button: Phaser.Input.Gamepad.Button,
      ) => {
        this.eventBus.emit("gamepadUp", { pad, button });
      },
    );
  }

  private setupEventListeners(): void {
    console.log(
      "🎧 InputSystem SETUP_EVENT_LISTENERS - Setting up update listener",
    );
    this.scene.events.on("update", () => {
      this.update();
    });
    console.log("🎧 InputSystem SETUP_EVENT_LISTENERS - Update listener set");
  }

  public update(): void {
    console.log("🔄 InputSystem UPDATE - Update method called");
    if (!this.enabled) {
      console.log("🔄 InputSystem UPDATE - System disabled, returning");
      return;
    }

    if (this.config.enableKeyboard) {
      this.updateKeyboardState();
    } else {
      console.log("🔄 InputSystem UPDATE - Keyboard not enabled in config");
    }
  }

  private updateKeyboardState(): void {
    // Update cursor keys
    if (this.cursors) {
      this.state.left = this.cursors.left.isDown;
      this.state.right = this.cursors.right.isDown;
      this.state.up = this.cursors.up.isDown;
      this.state.down = this.cursors.down.isDown;
    }

    // Update additional keys (combine with OR so both arrow keys and WASD work)
    this.keys.forEach((key, stateKey) => {
      const keyName = stateKey as
        | "left"
        | "right"
        | "up"
        | "down"
        | "space"
        | "shift";
      if (keyName in this.state) {
        (this.state as any)[keyName] =
          (this.state as any)[keyName] || key.isDown;
      }
    });

    // Emit key change events
    this.emitKeyChanges();
  }

  private emitKeyChanges(): void {
    type InputKey =
      | "left"
      | "right"
      | "up"
      | "down"
      | "space"
      | "shift"
      | "pointerDown";
    const keys: InputKey[] = [
      "left",
      "right",
      "up",
      "down",
      "space",
      "shift",
      "pointerDown",
    ];

    keys.forEach((stateKey) => {
      const currentValue = this.state[stateKey];
      const previousValue = this.previousState[stateKey];

      if (currentValue !== previousValue) {
        this.eventBus.emit("keyChanged", {
          key: stateKey,
          isDown: currentValue,
          isUp: !currentValue,
        });
      }
    });

    // Update previous state for the next frame
    this.previousState = { ...this.state };
  }

  public getState(): Readonly<InputState> {
    return { ...this.state };
  }

  public isPressed(
    key: "left" | "right" | "up" | "down" | "space" | "shift" | "pointerDown",
  ): boolean {
    const result = this.state[key];
    console.log(`🔑 InputSystem IS_PRESSED(${key}): ${result}`);
    return result;
  }

  public justPressed(
    key: "left" | "right" | "up" | "down" | "space" | "shift" | "pointerDown",
  ): boolean {
    const current = this.state[key];
    const previous = this.previousState[key];
    const result = current && !previous;
    console.log(
      `🔑 InputSystem JUST_PRESSED(${key}): ${result} (current: ${current}, previous: ${previous})`,
    );
    return result;
  }

  public justReleased(
    key: "left" | "right" | "up" | "down" | "space" | "shift" | "pointerDown",
  ): boolean {
    const current = this.state[key];
    const previous = this.previousState[key];
    return !current && previous;
  }

  public isMovingLeft(): boolean {
    return this.state.left;
  }

  public isMovingRight(): boolean {
    return this.state.right;
  }

  public isMovingUp(): boolean {
    return this.state.up;
  }

  public isMovingDown(): boolean {
    return this.state.down;
  }

  public isJumping(): boolean {
    return this.justPressed("up") || this.justPressed("space");
  }

  public getMousePosition(): { x: number; y: number } {
    return { x: this.state.mouseX, y: this.state.mouseY };
  }

  public destroy(): void {
    this.keys.forEach((key) => key.destroy());
    this.scene.input.removeAllListeners();
  }
}
