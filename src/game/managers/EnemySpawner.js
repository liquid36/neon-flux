import Phaser from "phaser";

export default class EnemySpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group();
    this.speed = 80;
  }

  setSpeed(v) {
    this.speed = v;
  }

  spawn() {
    const { width, height } = this.scene.scale;
    const edge = Phaser.Math.Between(0, 3);
    let x, y;
    const margin = 20;
    if (edge === 0) {
      x = Phaser.Math.Between(0, width);
      y = -margin;
    } else if (edge === 1) {
      x = width + margin;
      y = Phaser.Math.Between(0, height);
    } else if (edge === 2) {
      x = Phaser.Math.Between(0, width);
      y = height + margin;
    } else {
      x = -margin;
      y = Phaser.Math.Between(0, height);
    }

    const e = this.scene.add
      .polygon(x, y, [0, -10, 10, 10, -10, 10], 0xff66ff, 1)
      .setDepth(8);
    e.setBlendMode(Phaser.BlendModes.ADD);
    if (e.postFX?.addGlow) {
      e.postFX.addGlow(0xff66ff, 3.5, 0.6, false, 0.2, 6);
    }
    this.scene.physics.add.existing(e);
    e.body.setCircle(10);
    e.body.setOffset(-10, -10);
    this.group.add(e);
    return e;
  }

  /** Simple homing towards target (x,y) */
  steerTowards(targetX, targetY) {
    this.group.children.iterate((e) => {
      if (!e) return;
      const dir = new Phaser.Math.Vector2(targetX - e.x, targetY - e.y)
        .normalize()
        .scale(this.speed);
      e.body.setVelocity(dir.x, dir.y);
    });
  }

  /** Clears all enemies from scene */
  clearAll() {
    this.group?.clear(true, true);
  }
}
