#!bin/bash

# Crea las imagenes
docker-compose build

# Crea y levanta los contenedores
docker-compose up -d

# Crea la base de datos, ejecuta las migraciones y hace la primer carga de la db
docker exec -it gw-app rake db:create db:migrate db:seed

# Corrije error de la columna the_geom
docker exec -i gw-db psql --username postgres --dbname geoworks_development <<-EOSQL
  ALTER TABLE public.projects DROP COLUMN the_geom;
  ALTER TABLE public.projects ADD COLUMN the_geom geometry(Geometry,4326);
EOSQL

# Reinicia los contenedores
docker-compose restart
