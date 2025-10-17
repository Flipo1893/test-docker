FROM nginx:alpine

# Lösche Standard-HTML
RUN rm -rf /usr/share/nginx/html/*

# Kopiere Frontend-Dateien
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Port öffnen
EXPOSE 80

# Nginx im Vordergrund starten
CMD ["nginx", "-g", "daemon off;"]