# syntax=docker/dockerfile:1.6
FROM python:3.11-slim AS runtime
WORKDIR /srv

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

# Behind nginx the app is mounted at /quant/, so tell Streamlit its base URL
# path and disable CORS/XSRF (the gateway handles host/forwarded headers).
ENV STREAMLIT_SERVER_BASE_URL_PATH=/quant \
    STREAMLIT_SERVER_ENABLE_CORS=false \
    STREAMLIT_SERVER_ENABLE_XSRF_PROTECTION=false \
    STREAMLIT_BROWSER_GATHER_USAGE_STATS=false

CMD ["streamlit", "run", "streamlit_app.py", \
     "--server.address=0.0.0.0", \
     "--server.port=8501", \
     "--server.headless=true"]
