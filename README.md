# Deployar con Docker:

### Creamos las variables de entorno:

docker-env/geoserver.env
```
GEOSERVER_DATA_DIR=/opt/geoserver/data_dir
ENABLE_JSONP=true
MAX_FILTER_RULES=20
OPTIMIZE_LINE_WIDTH=false
FOOTPRINTS_DATA_DIR=/opt/footprints_dir
GEOWEBCACHE_CACHE_DIR=/opt/geoserver/data_dir/gwc
GEOSERVER_ADMIN_PASSWORD=<your-password>
```

docker-env/db.env
```
POSTGRES_USER=<your-user>
POSTGRES_PASSWORD=<your-password>
```

config/application.yml
```
GEOSERVER_USER: <your-user>
GEOSERVER_PASSWORD: <your-password>
DB_HOST: 'gw-db'
USER_NAME: <your-user>
USER_EMAIL: <your-email>
USER_PASSWORD: <your-password>
```

### Desde el root del proyecto:

Creamos las imagenes: `sudo docker-compose build`

Arrancamos los contenedores: `sudo docker-compose up -d`

Creamos la base de datos: `sudo docker exec -it gw-app rake db:create db:migrate db:seed`

### Fix temporal para el bug en la columna `the_geom`:

Entramos a la db: `sudo docker exec -it gw-db psql -U postgres geoworks_development`

- `ALTER TABLE public.projects DROP COLUMN the_geom;`
- `ALTER TABLE public.projects ADD COLUMN the_geom geometry(Geometry,4326);`

Ahora deberíamos poder acceder a la aplicación desde `<host>:3000`

# Configurar geoserver:

Ir a `<host>:8600/geoserver/web/`

### Agregar un nuevo espacio de trabajo

- Nombre: `geoworks`
- URI del espacio de nombres: `localhost`
- Habilitar "Espacio de trabajo por defecto"

Abrir el espacio de trabajo creado

- Habilitar el espacio de trabajo
- Habilitar los servicios `WCS`, `WFS` y `WMS`

### Agregar nuevo almacén de datos

**Origen de datos vectoriales:**

PostGIS - PostGIS Database

**Información básica del almacén:**

- Espacio de trabajo: `geoworks`
- Nombre del origen de datos: `geoworks`

**Parametros de conexión:**

- host: `gw-db`
- port: `5432`
- database: `<db_name>`
- schema: `public`
- user: `<db_user>`
- password: `<db_password>`

### Agregar un nuevo estilo

- Nombre: `poi_new`
- Estilo:

```
<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Zoom-based point</Name>
    <UserStyle>
      <Title>GeoServer SLD Cook Book: Zoom-based point</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Large</Name>
          <MaxScaleDenominator>16000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                  	<ogc:PropertyName>color</ogc:PropertyName>
                  </CssParameter>
                </Fill>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Medium</Name>
          <MinScaleDenominator>16000</MinScaleDenominator>
          <MaxScaleDenominator>52000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                  	<ogc:PropertyName>color</ogc:PropertyName>
                  </CssParameter>
                </Fill>
              </Mark>
              <Size>8</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        <Rule>
          <Name>Small</Name>
          <MinScaleDenominator>52000</MinScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">
                  	<ogc:PropertyName>color</ogc:PropertyName>
                  </CssParameter>
                </Fill>
              </Mark>
              <Size>6</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

- Nombre: `polygon_new`
- Estilo:
```
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
 xmlns="http://www.opengis.net/sld"
 xmlns:ogc="http://www.opengis.net/ogc"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>default_polygon</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Default Polygon</Title>
      <Abstract>A sample style that draws a polygon</Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering polygons -->
      <FeatureTypeStyle>
        <Rule>
          <Name>rule1</Name>
          <Title>Gray Polygon with Black Outline</Title>
          <Abstract>A polygon with a gray fill and a 1 pixel black outline</Abstract>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">
              <ogc:PropertyName>color</ogc:PropertyName>
              </CssParameter>
              <CssParameter name="fill-opacity">0.4</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#000000</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

### Fix temporal para cuando no se crea la capa correspondiente al proyecto

Ir a Capas

**Agregar nuevo recurso**

Agregar capa de `geoworks:geoworks`

Elegir el nombre de la capa en la lista y seleccionar "Publicación"

En la pestaña **Datos**

**Encuadres**

- Calcular desde los datos
- Calcular desde el encuadre nativo

En la pestaña **Publicación**

**Configuración WMS**

- Estilo por defecto: `geoworks:poi_new`
