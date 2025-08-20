# GridWars Web (Phaser + Vite)

Twin-stick shooter minimal inspirado en GridWars, hecho con Phaser 3 y Vite.

## Ejecutar

```bash
npm install
npm run dev
```

Abre el navegador en la URL que imprima Vite (ej. http://localhost:5173).

## Controles

- Movimiento: WASD o Flechas. Stick izquierdo en gamepad.
- Apuntar: Mouse o stick derecho en gamepad.
- Disparar: Clic izquierdo, Space, R1/R2/A en gamepad.
- Reiniciar tras Game Over: R.

## Notas técnicas

- Motor: Phaser 3 (Arcade Physics). Dev server: Vite.
- Efectos: PostFX Glow + blend aditivo para look neón (requiere WebGL).
- Partículas: Emisor con textura `dot` generada en runtime.

## Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de producción.
- `npm run preview`: previsualizar build.

## Próximos pasos sugeridos

- Bloom/Glow adicional y afinado visual.
- Tipos de enemigos y patrones de spawn.
- Audio (SFX/Música), pausa y ajustes.
- Controles táctiles y ajustes de rendimiento.
