# Precios Bimbo - Supermercados Uruguay

Monitor de precios de productos del Grupo Bimbo en Tata, Disco, Devoto y Tienda Inglesa.

## Uso local

1. Ejecuta `INSTALAR.bat` una sola vez.
2. Ejecuta `EJECUTAR.bat` cada vez que quieras relevar precios.

El proceso genera:

- `public/data/latest.json`
- `public/data/latest.csv`
- `public/data/latest.pdf`
- archivos fechados locales en `data/output/` (ignorados por Git)

## Web

Produccion: https://precios-bimbo.vercel.app

La web se despliega en Vercel desde `public/` y consume los archivos de `public/data/`.

## Marcas relevadas

- Bimbo
- Los Sorchantes
- Maestro Cubano
- Nutrabien / Nutra Bien
- Sanissimo / Salmas
- Pancatalan
- Tia Rosa
- Rapiditas
- Vital
- Artesano

## Actualizacion automatica

GitHub Actions ejecuta `.github/workflows/scrape.yml` dos veces por dia y tambien puede dispararse manualmente desde la web con el boton "Actualizar precios".

Para que el boton funcione en Vercel, el proyecto necesita:

- `GITHUB_TOKEN`
- `GITHUB_REPO`

## Si algo falla

- Verifica Node.js: `node --version` debe ser v18 o superior.
- Si un supermercado no responde, espera unos minutos y vuelve a correr el scrape.
- Revisa `/api/status` en produccion para ver el ultimo estado del workflow.
