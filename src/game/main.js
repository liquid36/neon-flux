import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene.js";
import PreloadScene from "./scenes/PreloadScene.js";

export default class Game extends Phaser.Game {
  constructor() {
    const config = {
      type: Phaser.AUTO,
      parent: "app",
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
      },
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      input: { gamepad: true },
      scene: [PreloadScene, PlayScene],
    };

    super(config);
  }
}
