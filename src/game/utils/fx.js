import Phaser from "phaser";

export function burst(scene, x, y, tint = 0xffffff) {
  const emitter = scene.add.particles(x, y, "dot", {
    speed: { min: 50, max: 180 },
    angle: { min: 0, max: 360 },
    lifespan: 350,
    scale: { start: 0.7, end: 0 },
    blendMode: Phaser.BlendModes.ADD,
  });
  emitter.setParticleTint(tint);
  emitter.explode(10, x, y);
  scene.time.delayedCall(500, () => emitter.destroy());
}
