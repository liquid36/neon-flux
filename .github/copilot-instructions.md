# AI Agent Guide for GridWars Web

This repo is a Phaser 3 + Vite twin-stick shooter (GridWars-like). Keep changes small, modular, and aligned with existing patterns.

## Architecture at a glance

- Runtime: Phaser 3 (Arcade Physics) bootstrapped via Vite.
  - Entry HTML: `index.html` (mounts `#app`, loads `/src/main.js`).
  - App entry: `src/main.js` instantiates `src/game/main.js` on `window.load`.
  - Game config: `src/game/main.js` defines the Phaser.Game, scale (1280x720, FIT), Arcade physics, and scene order `[PreloadScene, PlayScene]`.
- Scenes and responsibilities:
  - `src/game/scenes/PreloadScene.js`: placeholder for asset loading; immediately `scene.start('play')`.
  - `src/game/scenes/PlayScene.js`: core gameplay loop. Creates background grid, runtime texture `dot`, player circle with Arcade body, input (keyboard/mouse/gamepad), UI, collisions, game over.
- Managers (modular responsibilities):
  - `src/game/managers/BulletManager.js`: Arcade Physics Group pool for bullets using texture `dot`. `fire(sx,sy,tx,ty,speed)` spawns a physics image, sets additive glow, velocity from angle, and self-destroys off-screen.
  - `src/game/managers/EnemySpawner.js`: Arcade Physics Group for enemies. `spawn()` creates neon polygon enemies at screen edges, `steerTowards(x,y)` homes them toward the player, `clearAll()` wipes the group.
- Utilities:
  - `src/game/utils/fx.js`: `burst(scene,x,y,tint)` particles using Phaser 3.60+ API via `scene.add.particles(..., 'dot', config)`; additive blend and timed destroy.

Why this structure: keep the Scene thin and focused on orchestration, and encapsulate pools/behaviors (bullets, enemies, FX) in dedicated modules for scalability (more weapons/behaviors later) and performance (group-based pooling).

## Project workflows

- Dev server: Vite
  - `npm install`
  - `npm run dev` (default on http://localhost:5173, overridden port 8080 by `vite.config.mjs` — expect http://localhost:8080)
- Build / Preview
  - `npm run build`
  - `npm run preview`
- Gamepad support is enabled in config (`input: { gamepad: true }`).

## Patterns and conventions

- Visuals: neon look via `setBlendMode(Phaser.BlendModes.ADD)` and optional `postFX.addGlow` if available (WebGL).
- Particles: Phaser 3.60+ style. Avoid deprecated `createEmitter` on ParticleEmitterManager. Use `scene.add.particles(x,y,'dot', config)` and `emitter.explode(...)` with `setParticleTint` if tinting.
- Pools:
  - Bullets/enemies live in Group instances owned by managers. Inter-scene collisions must reference `manager.group`.
  - Current implementation calls `destroy()` on off-screen/collided bullets and enemies. If scaling up object counts, prefer `group.killAndHide(obj)` plus reset on reuse with `group.get(...)`.
- Input handling in `PlayScene.update`: keyboard WASD/Arrows, mouse aim, and gamepad sticks. Right trigger/shoulder or A also fires.
- Shooting cadence: cooldown tracked with `fireCooldown` and `fireInterval` (ms). Continuous fire if input held.
- Enemy spawn: timed event every 800ms; enemies steer toward the player each frame via `EnemySpawner.steerTowards`.
- Screen reset on life loss: `EnemySpawner.clearAll()` to remove all enemies; camera flash; game over shows overlay and waits for `R`.

## Cross-component interactions

- Collisions are wired in `PlayScene.create`:
  - Bullets vs. enemies: `this.physics.add.overlap(this.bullets.group, this.enemies.group, this.hitEnemy)`.
  - Player vs. enemies: `this.physics.add.overlap(this.player, this.enemies.group, this.hitPlayer)`.
- FX uses the runtime-generated `dot` texture; ensure `PlayScene` generates it before using `burst`.

## Examples (follow these when extending)

- Fire a bullet from the player toward the cursor:
  ```js
  this.bullets.fire(this.player.x, this.player.y, aimX, aimY, 1000);
  ```
- Spawn an enemy and home toward the player each frame:
  ```js
  this.enemies.spawn();
  this.enemies.steerTowards(this.player.x, this.player.y);
  ```
- Add a particle burst when an enemy dies:
  ```js
  import { burst } from "../utils/fx";
  burst(this, enemy.x, enemy.y, 0xff66ff);
  ```

## When adding features

- Keep `PlayScene` orchestration-focused; put new weapon logic into a `weapons/` module that calls `BulletManager.fire(...)`, and new enemy behaviors into `enemies/behaviors/` consumed by `EnemySpawner`.
- Reuse the `dot` texture for simple particles/bullets unless adding assets via `PreloadScene`.
- Maintain Arcade bodies for collisions; if switching to Sprites, ensure `classType` in groups and body setup mirror current circles.

## Files to start from

- Game boot/config: `src/game/main.js`
- Scene: `src/game/scenes/PlayScene.js`
- Managers: `src/game/managers/BulletManager.js`, `src/game/managers/EnemySpawner.js`
- Utilities: `src/game/utils/fx.js`
- Dev/build: `vite.config.mjs`, `package.json`
