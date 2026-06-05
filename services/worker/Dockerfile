FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
RUN useradd -r -s /bin/false appuser
USER appuser
CMD ["python", "src/worker.py"]