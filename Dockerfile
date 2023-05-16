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
ENV BASE_URL http://localhost:$SERVER_PORT
ENV SHOP_URL http://localhost:$SERVER_PORT/
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
    CMD curl -fk http://localhost:${PORT}/customer/health || exit 1

# Change Work directory
WORKDIR /app

# Copy packege json and package lock
COPY package*.json ./

# Install production packages
RUN npm ci && npm cache clean --force

FROM base as dev
ENV NODE_ENV development

# Copy source codes
COPY . .

# Copy Docker EntryPoint
COPY ./docker/docker-entrypoint-pro.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint-pro.sh" ]
CMD ["babel-node","./src/bin/www.js"]

# ENV DB_NAME vilibook_dev
# ENV DB_USER admin
# ENV APP_JWT_FILE /run/secrets/app-jwt-dev
# ENV SMS_CODE_JWT_FILE /run/secrets/sms-code-jwt-dev
# ENV DB_PASS_FILE /run/secrets/mongo-${DB_NAME}-${DB_USER}
# RUN npm i --only=development \
#     && npm cache clean --force
# COPY . .
# COPY ./docker/docker-entrypoint-dev.sh /usr/local/bin
# ENTRYPOINT ["docker-entrypoint-dev.sh" ]
# CMD ["npm" , "run", "start"]


FROM base as pro
ENV NODE_ENV production

# Copy source codes
COPY . .

# Copy Docker EntryPoint
COPY ./docker/docker-entrypoint-pro.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint-pro.sh" ]
CMD ["babel-node","./src/bin/www.js"]
