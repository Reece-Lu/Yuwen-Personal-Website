# syntax=docker/dockerfile:1.6

# Stage 1: build React app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV CI=false
# Skip ESLint at build time — eslint-config-react-app requires the `typescript`
# package even though this is a JS-only project.
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build

# Stage 2: serve static via nginx
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /app/build /usr/share/nginx/html

RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
