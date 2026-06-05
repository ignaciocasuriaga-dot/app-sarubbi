# Sarubbi Retail Watch

Monitor comercial para armar una propuesta de valor a Sarubbi: precios online, competencia, ofertas, precio moda, referencia/PVS, alertas e informe PDF.

## Que releva

- Marcas Sarubbi y competidores: Schneck, Centenario, Cattivelli, Ottonello, Camposur, La Constancia y Picorel.
- Cadenas online: Ta-Ta, Disco, Devoto, Geant, Tienda Inglesa, El Dorado, Ubesur y Tamisur.
- Cargas manuales para cadenas o distribuidores sin catalogo online confiable.
- Metricas comparables: precio por kg, por 100 g y por unidad/pieza segun la presentacion detectada.

## Uso local

```bash
npm install
npx playwright install chromium
npm run scrape
npm run pdf
npm run serve
```

El servidor local queda en `http://127.0.0.1:4173/`.

## Automatismo

`npm run serve` expone:

- `POST /api/refresh`: corre scrape y regenera PDF.
- `GET /api/status`: estado del refresh local y proxima corrida automatica.
- `GET /api/report/status`: estado de envio de reportes.
- `POST /api/report/send`: envio manual del PDF por email si Resend esta configurado.

Variables utiles:

- `SARUBBI_AUTO_REFRESH=0` para apagar el refresh local diario.
- `SARUBBI_AUTO_REFRESH_TIME=08:00` y `SARUBBI_AUTO_REFRESH_TZ=America/Montevideo`.
- `SARUBBI_DB=data/history/sarubbi.db` para la base historica.
- `REPORT_EMAIL_TO`, `RESEND_API_KEY`, `CRON_SECRET` para reportes automaticos.

## Datos

- `public/data/latest.json`: dataset usado por la web.
- `public/data/latest.csv`: exportable para analisis.
- `public/data/latest.pdf`: informe ejecutivo.
- `data/output/`: corridas fechadas locales.
- `data/manual/`: CSVs manuales para sumar fuentes.
- `data/suggested/precios_sugeridos.csv`: referencia/PVS opcional.

## Deploy

El repo incluye GitHub Actions para correr el scrape dos veces por dia y commitear `public/data`. Vercel puede publicar directamente `public/`.

Esta app es un port independiente inspirado en Gondola/CCU, enfocado en Sarubbi y listo para evolucionar hacia una demo comercial.
