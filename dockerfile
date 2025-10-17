# Verwende schlankes Nginx-Image
FROM nginx:alpine

# Lösche Standard-HTML-Seite von Nginx
RUN rm -rf /usr/share/nginx/html/*

# Kopiere alle Dateien aus deinem Projektverzeichnis
COPY . /usr/share/nginx/html

# Port öffnen (optional)
EXPOSE 80
