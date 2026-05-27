# syntax=docker/dockerfile:1.6

# Stage 1: build Vue 2 app
# Node 18 — the build script uses --openssl-legacy-provider in NODE_OPTIONS,
# which is a Node 17+ flag (works around webpack 4 vs OpenSSL 3 breakage).
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build

# Stage 2: serve static via nginx
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html

# publicPath in vue.config.js is /residentialcomplex/ — keep that path
RUN mkdir -p /usr/share/nginx/html-root/residentialcomplex \
    && mv /usr/share/nginx/html/* /usr/share/nginx/html-root/residentialcomplex/ \
    && rm -rf /usr/share/nginx/html \
    && mv /usr/share/nginx/html-root /usr/share/nginx/html

RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location /residentialcomplex/ {\n    try_files $uri $uri/ /residentialcomplex/index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
