# Deploy Sarubbi Retail Watch

Flujo recomendado para demo:

```text
GitHub Actions corre el scraping
  -> actualiza JSON, CSV y PDF en public/data
  -> commitea los cambios
Vercel publica public/
  -> el cliente ve siempre el ultimo tablero
```

## GitHub Actions

El workflow principal es `.github/workflows/scrape.yml`.

- Corre 08:00 y 18:00 Uruguay.
- Tambien se puede disparar manualmente desde la pestana Actions.
- Instala dependencias, corre `node src/main.js`, genera `node src/pdf.js` y commitea `public/data`.

## Vercel

Config recomendada:

- Framework Preset: `Other`
- Build Command: vacio
- Output Directory: `public`
- Install Command: vacio o `npm ci` si se usan APIs serverless

Variables opcionales:

- `APP_URL`: URL publica del tablero.
- `GITHUB_REPO`: `ignaciocasuriaga-dot/app-sarubbi`
- `GITHUB_TOKEN`: token con permiso para disparar workflows si se habilita refresh remoto.
- `REPORT_EMAIL_TO`, `RESEND_API_KEY`, `CRON_SECRET`: envio automatico de PDF.

## Verificacion

1. Abrir `/data/latest.json` y confirmar que tenga `items`.
2. Abrir `/data/latest.pdf` y confirmar que se renderice.
3. Abrir la web y revisar tabs de catalogo, comparativa, portfolio y automatismo.
4. Ejecutar manualmente el workflow si se necesita refrescar antes de la reunion.
