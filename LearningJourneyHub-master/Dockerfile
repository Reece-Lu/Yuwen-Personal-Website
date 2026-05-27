# syntax=docker/dockerfile:1.6

# Stage 1: build Writerside docs using JetBrains builder
FROM registry.jetbrains.team/p/writerside/builder/writerside-builder:232.10165 AS builder
WORKDIR /opt/sources

COPY . .

# Build the 'hi' instance into a zip artifact (matches the GitHub workflow)
RUN export DISPLAY=:99 \
    && /opt/builder/bin/idea.sh helpbuilderinspect \
        --source-dir /opt/sources \
        --product Writerside/hi \
        --runner other \
        --output-dir /opt/output \
    && cd /opt/output \
    && unzip -O UTF-8 -qq webHelpHI2-all.zip -d /opt/site

# Stage 2: serve generated HTML
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /opt/site /usr/share/nginx/html-src

RUN mkdir -p /usr/share/nginx/html/notes \
    && cp -r /usr/share/nginx/html-src/* /usr/share/nginx/html/notes/ \
    && rm -rf /usr/share/nginx/html-src

RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location /notes/ {\n    try_files $uri $uri/ /notes/index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
