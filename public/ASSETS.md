# Assets de marca

La web usa un solo logo oficial en el header:

| Archivo | Uso |
|---|---|
| `public/logo.jpg` | Logo visible del header y favicon |

No hay placeholder ni mascota generica. Si queres reemplazar el logo, mantenelo con el mismo nombre para que Vercel lo publique sin tocar codigo.

Tambien guardamos copias de referencia en `assets-para-subir/`, pero la app solo necesita `public/logo.jpg`.

## Competencia en catalogo

Los competidores usan marcas visuales minimalistas locales en `public/assets/logos/brands/`. Son SVGs livianos para la UI del catalogo y filtros; si se reemplazan por logos oficiales, mantener los mismos nombres evita tocar codigo.

## Biblioteca visual Sarubbi

La carpeta `public/assets/sarubbi/site/` contiene imagenes traidas del sitio oficial `sarubbi.com.uy`: productos, campanas, planta industrial, fondos, sellos e identidad. La base `public/data/sarubbi-assets.json` indexa cada asset con tema, origen, rutas locales, keywords y uso potencial.

El catalogo usa el logo compacto `public/assets/sarubbi/site/imgs/sarubbi-logo.png` para los badges de Marca y Dueno, y elige miniaturas de `public/assets/sarubbi/site/imgs/productos/` por match de keywords/categoria.
