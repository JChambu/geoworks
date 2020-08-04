# Deploy con Docker

### Creamos las variables de entorno

*geoworks/.env*

```
# Geoserver
GEOSERVER_HOST=gw-geoserver
GEOSERVER_PORT=<8600/443>
GEOSERVER_ADMIN_PASSWORD=<geoserver-admin-password>
GEOSERVER_DATA_DIR=/opt/geoserver/data_dir
ENABLE_JSONP=true
MAX_FILTER_RULES=20
OPTIMIZE_LINE_WIDTH=false
FOOTPRINTS_DATA_DIR=/opt/footprints_dir
GEOWEBCACHE_CACHE_DIR=/opt/geoserver/data_dir/gwc

# Postgres
POSTGRES_HOST=gw-db
POSTGRES_DATABASE=<database name, eg. geoworks_development>
POSTGRES_USER=<postgres-user>
POSTGRES_PASSWORD=<postgres-password>

# App
APP_PORT=80
```

*geoworks/config/application.yml*

``` yml
MAILER_DOMAIN: geoworks.com.ar
MAILER_USERNAME: geoworks.lite@gmail.com
MAILER_PASSWORD: <mailer-password>
USER_NAME: <your-user>
USER_EMAIL: <your-email>
USER_PASSWORD: <your-password>
```

### Deployamos

``` sh
sudo sh deploy.sh
```

Ahora deberíamos poder acceder a la aplicación desde `<host>:<app-port>`

##### Alternativamente podemos ejecutar los comandos de `deploy.sh` por separado:

Creamos las imágenes:

``` sh
sudo docker-compose build
```

Creamos y levantamos los contenedores:
``` sh
sudo docker-compose up -d
```

Creamos la base de datos:

``` sh
sudo docker exec -it gw-app rake db:create db:schema:load db:seed
```

### Comandos útiles de Docker:

- Listar los contenedores: `sudo docker ps -a` ([+info](https://docs.docker.com/engine/reference/commandline/ps/))

- Arrancar un contenedor: `sudo docker start <nombre-contenedor>` ([+info](https://docs.docker.com/engine/reference/commandline/start/))

- Detener un contenedor: `sudo docker stop <nombre-contenedor>` ([+info](https://docs.docker.com/engine/reference/commandline/stop/))

- Capturar los logs de un contenedor: `sudo docker logs <nombre-contenedor>` ([+info](https://docs.docker.com/engine/reference/commandline/logs/))

- Seguir los logs con docker-compose: `sudo docker-compose logs -f` ([+info](https://docs.docker.com/compose/reference/logs/))

- Listar los volúmenes: `sudo docker volume ls` ([+info](https://docs.docker.com/engine/reference/commandline/volume/))


# Configurar Geoserver

Ir a `<host>:8600/geoserver/web/`

### Agregar un nuevo espacio de trabajo

- Nombre: `geoworks`
- URI del espacio de nombres: `geoworks`
- Habilitar "Espacio de trabajo por defecto"

### Agregar nuevo almacén de datos

**Origen de datos vectoriales:**

PostGIS - PostGIS Database

**Información básica del almacén:**

- Espacio de trabajo: `geoworks`
- Nombre del origen de datos: `geoworks`

**Parametros de conexión:**

- host: `gw-db`
- port: `5432`
- database: `<postgres-database, eg. geoworks_development>`
- schema: `public`
- user: `<postgres-user>`
- password: `<postgres-password>`

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
