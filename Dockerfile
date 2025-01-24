# BASE IMAGE
FROM ruby:2.5 AS base

RUN apt-get update -qq \
    && apt-get install -y \
    build-essential \
    netcat-openbsd \
    libpq-dev \
    nodejs \
    libproj-dev \
    libgeos-dev \
    && rm -rf /var/lib/apt/lists/*

# BUILDER IMAGE
FROM base AS builder

WORKDIR /app

ADD Gemfile /app/Gemfile

ADD Gemfile.lock /app/Gemfile.lock

# Para la imagen final en producion quitar dev, staging y test
#RUN bundle config set without "development staging test" && \
#    bundle install --jobs=3 --retry=3

RUN bundle install --jobs=3 --retry=3

ADD . /app

RUN bundle install --path ./vendor

# FINAL IMAGE
FROM base AS final

RUN apt-get update -qq \
    && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

ARG USERNAME=app
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

WORKDIR /app

COPY --from=builder /app/ /app/

RUN bundle install --path ./vendor

RUN chown -R $USER_UID:$USER_GID /app
USER $USERNAME

EXPOSE 3000

ENTRYPOINT ["sh", "./start-dev.sh"]
