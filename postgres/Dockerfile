
FROM postgres:9.6

# Repositories deprecated for debian stretch
RUN rm /etc/apt/sources.list.d/pgdg.list
RUN apt-get update && apt-get -y install apt-transport-https
RUN echo "deb https://apt-archive.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgis \
    postgresql-9.6-pgrouting \
    postgresql-9.6-pgrouting-scripts \
    liblwgeom-2.3-0 \
    postgresql-9.6-postgis-2.3 \
    postgresql-9.6-postgis-2.3-scripts \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 5432