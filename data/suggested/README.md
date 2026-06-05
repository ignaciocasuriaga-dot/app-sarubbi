# Lista de precio referencia/PVS

Coloca aca `precios_sugeridos.csv` para cruzar precios relevados contra una lista propia de referencia.

Columnas aceptadas:

- `super`: `Tata`, `Disco`, `Devoto`, `Geant`, `El Dorado`, `Tienda Inglesa` o `todos`
- `sku`: opcional, recomendado cuando se conoce el codigo del supermercado
- `marca`: Sarubbi
- `producto`: nombre o descripcion del producto propio
- `pvp_sugerido`: precio teorico de venta al publico

El cruce usa primero `super + sku`. Si no hay SKU, usa `super + marca + presentacion + similitud del nombre`.

Todavia no hay lista oficial Sarubbi; este modulo queda preparado para cargarla cuando exista.
