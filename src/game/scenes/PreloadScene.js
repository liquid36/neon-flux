import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // TODO: load sprites, sounds
  }

  create() {
    this.scene.start("play");
  }
}
