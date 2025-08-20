import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Sprites
    this.load.image("yellowshot", "assets/yellowshot.png");
  }

  create() {
    this.scene.start("play");
  }
}
