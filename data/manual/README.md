# Cargas manuales por fuente

Para cadenas sin catalogo online confiable, agrega CSVs en esta carpeta. Hay una plantilla en `cadenas-extra.csv.example`.

Formato minimo:

```csv
cadena,producto,precio,precio_lista,url
frog,Sarubbi Jamon Cocido 200 g,189,219,
macromercado,Schneck Panchos x 6,165,,
kinko,Picorel Salame feteado 100 g,129,149,
elvencedor,Ottonello Mortadela 250 g,115,,
```

Columnas aceptadas:

- `cadena` o `super`
- `producto` o `nombre`
- `precio`
- `precio_lista`
- `sku`
- `url`
- `moneda`

Fuentes reconocidas:

- `frog`
- `macromercado`
- `kinko`
- `elvencedor`
- `manual`

Para clasificar bien, incluir marca, producto y presentacion en el nombre.
