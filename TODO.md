# TODO · Investigación: GridWars / Geometry Wars

Resumen práctico para planificar features inspiradas en Geometry Wars / GridWars.

## Tipos de enemigos (arquetipos)
- Swarm / Grunt: buscan al jugador en masa; baja vida; velocidad media.
- Dodger (Green): evitan balas y hacen dashes impredecibles; difícil de rastrear.
- Rusher / Dart: cargas rápidas en línea recta desde bordes; alta velocidad.
- Spinner / Pinwheel: giran y avanzan en espiral; cierran espacios.
- Splitter: al morir se divide en 2–4 unidades menores; 2–3 niveles.
- Snake / Worm: segmentados; serpentean para encerrar; cabeza vulnerable.
- Mine / Proximity: estacionarios; explotan por proximidad/tiempo en anillos.
- Turret / Sentry: estacionarios; disparo radial o barrido; zona de control.
- Bomber: lento; salvas o deja minas; gran área de amenaza.
- Spawner / Carrier: genera grunts periódicamente; prioridad alta.
- Shielded: escudo direccional; vulnerable por flancos/espalda.
- Teleporter: se teletransporta corto alcance para flanquear.
- Homing Rocket: misil con guiado y aceleración; se puede kitear/destruir.
- Singularity / Black Hole: pozo gravitatorio que atrae y luego explota.
- Shrapnel: al morir suelta metralla en patrón fijo.

## Tipos de disparos / armas del jugador
- Blaster (base): proyectil único continuo hacia el puntero; DPS estable.
- Spread / Tri-shot: 3–5 proyectiles en cono; alcance corto-medio.
- Burst / Shotgun: ráfaga densa de corto alcance; alto daño, mayor cooldown.
- Beam / Laser: rayo continuo penetrante; requiere tracking preciso.
- Pierce / Railgun: disparo cargado que atraviesa múltiples objetivos.
- Homing Missiles: misiles con guiado suave; útiles vs dodgers/rushers.
- Rockets / Explosive: proyectiles con radio de explosión; control de masas.
- Orbital / Drones: orbes/drones orbitan y disparan automáticamente.
- Nova / Pulse: pulso radial alrededor del jugador; despeje cercano.
- Deployable Turret: torreta temporal que dispara; control de zona.
- Black Hole / Super: singularidad que agrupa y luego limpia; recurso limitado.
- Smart Bomb (clásico): limpia pantalla; usos limitados (escape/pánico).

## Notas de diseño
- Mezcla exacta varía por entrega, pero estos arquetipos cubren la mayoría de patrones.
- Greens/dodgers castigan armas lentas; snakes exigen movilidad; splitters/shrapnel castigan overkill sin control.

## Milestone sugerido (MVP extendido)
- Enemigos: Grunt, Dodger, Splitter, Snake.
- Armas: Blaster, Spread, Nova.
- Integración:
  - `EnemySpawner` + `behaviors/` por arquetipo (homing, dodge, split, snake path).
  - `BulletManager` + `weapons/` para patrones (spread, nova) reutilizando textura `dot`.
  - Colisiones: mantener `manager.group` para overlaps.
