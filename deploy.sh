#!bin/bash

# Crea las imagenes
docker-compose build

# Crea y levanta los contenedores
docker-compose up -d

# Crea la base de datos, ejecuta las migraciones y hace la primer carga de la db
docker exec -it gw-app rake db:create db:schema:load db:seed
