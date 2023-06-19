# base image
FROM node:18.11.0-bullseye as base

# Install requirements
RUN set -eux && \
    apt update -y && \
    apt install -y --no-install-recommends \
    cron

# Set Enviroments
ENV EnvLoader Docker
ENV PATH /app/node_modules/.bin:$PATH
ENV BABEL_CACHE_PATH "./node_modules/babel-cache.json"
ENV defaultLanguage en
ENV language fa
ENV GENERATE_SOURCEMAP false
ENV mongodbConnectionUrl mongodb://mongodb:27017
ENV SERVER_PORT 3000

# ENV CLIENT_PORT 3001
# ENV ADMIN_PORT 3002
ENV dbName Idehweb
ENV SITE_NAME Idehweb
ENV BASE_URL http://localhost:${SERVER_PORT}
ENV SHOP_URL http://localhost:${SERVER_PORT}/
# ENV ADMIN_URL http://localhost:$ADMIN_PORT
# ENV SERVER_MODE client
ENV RESET false
ENV ADMIN_EMAIL admin@idehweb.com
ENV ADMIN_USERNAME admin
ENV ADMIN_PASSWORD admin
ENV TZ "Asia/Tehran"
ENV BABEL_CACHE_PATH ./node_modules/babel-cache.json

# Expose All Ports
EXPOSE ${SERVER_PORT}

HEALTHCHECK --interval=1m --timeout=15s --retries=3 --start-period=2m \
    CMD curl -fk http://localhost:${SERVER_PORT}/customer/settings/health || exit 1


# Pre-Requirements for mongoshell , mongotools
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - \
    && apt-get install gnupg \ 
    && wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - \
    && echo "deb https://repo.mongodb.org/apt/debian/ bullseye/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install mongosh , mongotools
RUN apt-get update \ 
    && apt-get install -y --no-install-recommends \ 
    mongodb-mongosh \
    mongodb-database-tools \
    && rm -rf /var/lib/apt/lists/*


# Change Work directory
WORKDIR /app

# Copy packege json and package lock
COPY package*.json ./

# Install production packages
RUN npm ci && npm cache clean --force

FROM base as dev
ENV NODE_ENV development

RUN npm i --only=development \
    && npm cache clean --force

# Copy source codes
COPY . .

# Copy Docker EntryPoint
COPY ./docker/docker-entrypoint-dev.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint-dev.sh" ]
CMD ["npm","start"]


FROM base as pro
ENV NODE_ENV production

# Copy source codes
COPY . .

# Copy Docker EntryPoint
COPY ./docker/docker-entrypoint-pro.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint-pro.sh" ]
CMD ["node","./src/bin/www.mjs"]