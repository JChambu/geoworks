FROM ruby:2.5

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs libproj-dev libgeos-dev

RUN mkdir -p /opt/geoworks
WORKDIR /opt/geoworks

COPY Gemfile /opt/geoworks/Gemfile
COPY Gemfile.lock /opt/geoworks/Gemfile.lock

RUN bundle install

COPY . /opt/geoworks

# Exponer el puerto que será utilizado por la aplicación
EXPOSE 3000

# Comando por defecto que ejecutará el servidor de Rails y eliminará el archivo PID
CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0'"]
