FROM postgres:9.6

ENV POSTGIS_MAJOR 2.3
ENV POSTGIS_VERSION 2.3.1+dfsg-2

# Repositories deprecated for debian stretch
RUN rm /etc/apt/sources.list.d/pgdg.list
RUN apt-get update && apt-get -y install apt-transport-https
RUN echo "deb https://apt-archive.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update \
      && apt-get install -y --no-install-recommends \
           postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION \
           postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts=$POSTGIS_VERSION \
           postgis=$POSTGIS_VERSION \
      && rm -rf /var/lib/apt/lists/*
