FROM ruby:2.5

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs libproj-dev libgeos-dev

RUN mkdir -p /opt/geoworks
WORKDIR /opt/geoworks

COPY Gemfile /opt/geoworks/Gemfile
COPY Gemfile.lock /opt/geoworks/Gemfile.lock

RUN bundle install

COPY . /opt/geoworks
