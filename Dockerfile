FROM python:3.12-slim

# Arbeitsverzeichnis auf /app/backend setzen
WORKDIR /app/backend

# Requirements zuerst kopieren und installieren
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Restliches Backend + Frontend kopieren
COPY backend ./
COPY ../frontend ../frontend

# Port für Flask
EXPOSE 5000

# Startbefehl (direkt Flask starten)
CMD ["python", "app.py"]
