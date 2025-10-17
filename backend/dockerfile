FROM python:3.11-alpine

WORKDIR /app

# Kopiere Requirements und installiere Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiere den Rest des Codes
COPY . .

# Erstelle leere bookmarks.json falls nicht vorhanden
RUN touch bookmarks.json && echo "[]" > bookmarks.json

# Port öffnen (Railway nutzt $PORT Umgebungsvariable)
EXPOSE 5000

# Gunicorn für Production (besser als Flask dev server)
CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 4 app:app