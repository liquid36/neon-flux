import Phaser from "phaser";

// BulletManager: handles a Physics Group of bullets and firing logic.
export default class BulletManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      defaultKey: "dot",
      maxSize: 500,
      runChildUpdate: true,
    });
  }

  /**
   * Fires a bullet from (sx, sy) towards (tx, ty) with fixed speed.
   */
  fire(sx, sy, tx, ty, speed = 1000) {
    const useKey = this.scene.textures?.exists("yellowshot")
      ? "yellowshot"
      : "dot";
    const b = this.scene.physics.add.image(sx, sy, useKey);
    if (!b) return null;
    this.group.add(b);

    b.setActive(true).setVisible(true);
    b.setDepth(11);
    b.setBlendMode(Phaser.BlendModes.ADD);
    // if (b.postFX?.addGlow) {
    //   b.postFX.addGlow(0xffee88, 4, 0.5, false, 0.2, 6);
    // }
    // Physics body config
    b.body.setAllowGravity(false);
    b.body.setImmovable(false);
    b.body.setCollideWorldBounds(false);

    const angle = Phaser.Math.Angle.Between(sx, sy, tx, ty);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    b.body.moves = true;
    b.setVelocity(vx, vy);

    // Rotate sprite to travel direction; asset points UP, so add +90°.
    if (useKey === "yellowshot") {
      b.setOrigin(0.5, 0.5);
      b.setRotation(angle + Math.PI / 2);
      // Tweak scale/body for a slim projectile
      b.setScale(0.9);
      // Resize body roughly to sprite's visual core
      const bw = b.displayWidth * 0.7;
      const bh = b.displayHeight * 0.7;
      b.body.setSize(bw, bh, true);
    } else {
      // Dot bullet: circular body
      b.body.setCircle(4);
    }

    // Off-screen cleanup
    const scene = this.scene;
    b.update = () => {
      const { width, height } = scene.scale;
      const margin = 16;
      if (
        b.x < -margin ||
        b.x > width + margin ||
        b.y < -margin ||
        b.y > height + margin
      ) {
        b.destroy();
      }
    };

    return b;
  }
}
