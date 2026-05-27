# syntax=docker/dockerfile:1.6
FROM python:3.10-slim AS runtime
WORKDIR /srv

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Behind the nginx gateway the service is mounted at /api/*, so tell FastAPI
# where it's actually being served from. Override to "" for direct local use.
ENV ROOT_PATH=/api

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
