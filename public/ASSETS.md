# Assets de marca

Para usar los logos oficiales en la web, dropeá los archivos en esta carpeta (`public/`) con estos nombres exactos:

| Archivo | Reemplaza | Formato sugerido |
|---|---|---|
| `mascot.png` | El osito placeholder del header | PNG transparente, ~120px alto |
| `logo.png` | El wordmark "Precios Bimbo" del header | PNG transparente, ~200px ancho |

La app los detecta automáticamente al cargar — si están, los usa; si no, queda el placeholder.

Formatos aceptados (en orden de preferencia): `.svg`, `.png`, `.webp`, `.jpg`.

## Después de dropear los archivos

```
git add public/mascot.png public/logo.png
git commit -m "assets: logos oficiales"
git push
```

Vercel auto-deployea en ~30 segundos y la web ya usa los oficiales.

## Dimensiones recomendadas

- **Mascot**: cuadrado o casi (1:1), fondo transparente, mínimo 100×100 px, ideal SVG vectorial.
- **Logo**: horizontal, fondo transparente, alto ~80 px, ideal SVG vectorial. Que se lea bien sobre fondo crema (`#FFF8E7`).
