# Basis-Image
FROM python:3.12-slim

# Arbeitsverzeichnis
WORKDIR /app

# Requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend & Frontend kopieren
COPY backend ./backend
COPY frontend ./frontend

# Port öffnen
EXPOSE 5000

CMD ["python", "backend/app.py"]
