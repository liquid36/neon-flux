import Phaser from "phaser";

// Spread weapon: fires a configurable number of bullets in a cone around the aim.
export default class SpreadWeapon {
  /**
   * @param {Phaser.Scene} scene
   * @param {import("../managers/BulletManager").default} bullets
   */
  constructor(scene, bullets) {
    this.scene = scene;
    this.bullets = bullets;
    this.shotCount = 1; // 1, 3, 5
    this.speed = 1000;
  }

  setShotCount(n) {
    this.shotCount = Math.max(1, n | 0);
  }

  setSpeed(n) {
    this.speed = Math.max(1, n | 0);
  }

  /**
   * Fires bullets from (sx,sy) towards aim (tx,ty) using current shotCount in a cone.
   */
  fire(sx, sy, tx, ty) {
    const n = this.shotCount;
    if (n <= 1) {
      this.bullets.fire(sx, sy, tx, ty, this.speed);
      return;
    }

    const baseAngle = Phaser.Math.Angle.Between(sx, sy, tx, ty);
    // Total cone width scales subtly with count; keep it readable but tight
    const totalDeg = n === 3 ? 28 : 42; // 3-shot ~28°, 5-shot ~42°
    const totalRad = Phaser.Math.DEG_TO_RAD * totalDeg;

    // Evenly distribute around baseAngle (centered)
    const step = n > 1 ? totalRad / (n - 1) : 0;
    const start = baseAngle - totalRad / 2;

    for (let i = 0; i < n; i++) {
      const ang = start + step * i;
      const range = 1000; // used only to compute a far target point
      const tx2 = sx + Math.cos(ang) * range;
      const ty2 = sy + Math.sin(ang) * range;
      this.bullets.fire(sx, sy, tx2, ty2, this.speed);
    }
  }
}
