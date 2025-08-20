import Phaser from "phaser";
import BulletManager from "../managers/BulletManager";
import EnemySpawner from "../managers/EnemySpawner";
import { burst } from "../utils/fx";
import SpreadWeapon from "../weapons/Spread";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("play");
  }

  create() {
    // Minimal twin-stick feel: player + pointer aim + keyboard/gamepad
    this.cameras.main.setBackgroundColor("#000");

    // Grid-like background using Graphics
    const g = this.add.graphics();
    const { width, height } = this.scale;
    g.lineStyle(1, 0x003355, 0.5);
    const cell = 32;
    for (let x = 0; x <= width; x += cell) g.lineBetween(x, 0, x, height);
    for (let y = 0; y <= height; y += cell) g.lineBetween(0, y, width, y);

    // Generate a tiny circle texture for particles
    const pg = this.make.graphics({ x: 0, y: 0, add: false });
    pg.fillStyle(0xffffff, 1);
    pg.fillCircle(4, 4, 4);
    pg.generateTexture("dot", 8, 8);
    pg.destroy();

    // Player
    this.player = this.add
      .circle(width / 2, height / 2, 10, 0x66ccff)
      .setDepth(10);
    // Neon look: additive blend + glow (if WebGL FX available)
    this.player.setBlendMode(Phaser.BlendModes.ADD);
    if (this.player.postFX?.addGlow) {
      // color, outerStrength, innerStrength, knockout, quality, distance
      this.player.postFX.addGlow(0x66ccff, 5, 0.8, false, 0.2, 8);
    }
    this.physics.add.existing(this.player);
    this.player.body.setCircle(10);

    this.speed = 300;
    this.lives = 3;
    this.score = 0;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");

    this.input.gamepad.once("connected", (pad) => {
      this.pad = pad;
    });

    // Managers
    this.bullets = new BulletManager(this);
    this.fireCooldown = 0;
    // Global fire rate limit: 2 shots per second for all modes
    this.shotsPerSecond = 2;
    this.fireInterval = 1000 / this.shotsPerSecond; // ms

    // Weapon: Spread (supports 1,3,5 shots)
    this.weapon = new SpreadWeapon(this, this.bullets);
    this.weapon.setShotCount(1);

    // Keyboard weapon selection: 1,2,3 => 1,3,5
    this.input.keyboard.on("keydown-ONE", () => this.weapon.setShotCount(1));
    this.input.keyboard.on("keydown-TWO", () => this.weapon.setShotCount(3));
    this.input.keyboard.on("keydown-THREE", () => this.weapon.setShotCount(5));

    // Enemies
    this.enemies = new EnemySpawner(this);
    this.enemySpeed = 80;
    this.enemies.setSpeed(this.enemySpeed);
    this.spawnTimer = this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => this.enemies.spawn(),
    });

    // Collisions
    this.physics.add.overlap(this.bullets.group, this.enemies.group, (b, e) =>
      this.hitEnemy(b, e)
    );
    this.physics.add.overlap(this.player, this.enemies.group, (p, e) =>
      this.hitPlayer(e)
    );

    // UI
    this.ui = this.add
      .text(10, 10, "Score: 0  Lives: 3", { fontSize: 16, color: "#88ddee" })
      .setDepth(100);
  }

  update(time, delta) {
    const body = this.player.body;
    const v = new Phaser.Math.Vector2(0, 0);

    // Keyboard WASD/Arrows
    if (this.cursors.left.isDown || this.keys.A.isDown) v.x -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) v.x += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) v.y -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) v.y += 1;

    // Left stick if available
    if (this.pad) {
      const ls = this.pad.leftStick;
      if (Math.abs(ls.x) > 0.15 || Math.abs(ls.y) > 0.15) {
        v.x = ls.x;
        v.y = ls.y;
      }
    }

    v.normalize().scale(this.speed);
    body.setVelocity(v.x, v.y);

    // Aim with mouse or right stick
    let aimX = this.input.activePointer.worldX;
    let aimY = this.input.activePointer.worldY;
    if (this.pad) {
      const rs = this.pad.rightStick;
      if (Math.abs(rs.x) > 0.2 || Math.abs(rs.y) > 0.2) {
        aimX = this.player.x + rs.x * 1000;
        aimY = this.player.y + rs.y * 1000;
      }
    }

    // Draw a small line to indicate aim
    if (!this.aimGfx) {
      this.aimGfx = this.add.graphics({ depth: 9 });
      this.aimGfx.setBlendMode(Phaser.BlendModes.ADD);
    }
    this.aimGfx.clear();
    this.aimGfx.lineStyle(2, 0xffcc00, 0.8);
    this.aimGfx.lineBetween(this.player.x, this.player.y, aimX, aimY);

    // Shooting
    this.fireCooldown -= delta;
    const isFiring =
      this.input.activePointer.isDown ||
      this.cursors.space?.isDown ||
      this.keys.SPACE?.isDown ||
      (this.pad && (this.pad.R2 > 0.1 || this.pad.R1 > 0.1 || this.pad.A));
    if (isFiring && this.fireCooldown <= 0) {
      this.fireCooldown = this.fireInterval;
      this.fireBullet(aimX, aimY);
    }

    // Enemies AI: steer towards player
    this.enemies.steerTowards(this.player.x, this.player.y);
  }

  fireBullet(tx, ty) {
    // Delegate to current weapon
    this.weapon.fire(this.player.x, this.player.y, tx, ty);
  }

  // spawnEnemy removed: handled by EnemySpawner

  hitEnemy(b, e) {
    if (b?.destroy) b.destroy();
    if (e?.destroy) e.destroy();
    this.score += 10;
    this.ui.setText(`Score: ${this.score}  Lives: ${this.lives}`);
    // Tiny burst (Phaser 3.60+ particles API)
    burst(this, e.x, e.y, 0xff66ff);
  }

  hitPlayer(e) {
    if (e?.destroy) e.destroy();
    // Reset screen on life loss: remove all enemies
    this.enemies?.clearAll();
    this.lives -= 1;
    this.cameras.main.flash(200, 255, 64, 64);
    this.ui.setText(`Score: ${this.score}  Lives: ${this.lives}`);
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.physics.pause();
    this.spawnTimer?.remove();
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, "GAME OVER\nPress R to Restart", {
        fontSize: 32,
        color: "#ff7777",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);
    this.input.keyboard.once("keydown-R", () => this.scene.restart());
  }
}
