from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Erlaubt Frontend-Zugriff von allen Origins

# Konfiguration
BOOKMARKS_FILE = 'bookmarks.json'

# Stelle sicher, dass die Datei existiert
if not os.path.exists(BOOKMARKS_FILE):
    with open(BOOKMARKS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

# Hilfsfunktion zum Laden der Bookmarks
def load_bookmarks():
    try:
        with open(BOOKMARKS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Hilfsfunktion zum Speichern der Bookmarks
def save_bookmarks(bookmarks):
    with open(BOOKMARKS_FILE, 'w', encoding='utf-8') as f:
        json.dump(bookmarks, f, ensure_ascii=False, indent=2)

# GET: Alle Bookmarks abrufen
@app.route('/api/bookmarks', methods=['GET'])
def get_bookmarks():
    try:
        bookmarks = load_bookmarks()
        return jsonify(bookmarks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# POST: Neues Bookmark hinzufügen
@app.route('/api/bookmarks', methods=['POST'])
def add_bookmark():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        if not data.get('title') or not data.get('url'):
            return jsonify({'error': 'Titel und URL sind erforderlich'}), 400
        
        bookmarks = load_bookmarks()
        
        new_bookmark = {
            'id': int(datetime.now().timestamp() * 1000),
            'title': data['title'],
            'url': data['url'],
            'created_at': datetime.now().isoformat()
        }
        
        bookmarks.append(new_bookmark)
        save_bookmarks(bookmarks)
        
        return jsonify(new_bookmark), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# DELETE: Bookmark löschen
@app.route('/api/bookmarks/<int:bookmark_id>', methods=['DELETE'])
def delete_bookmark(bookmark_id):
    try:
        bookmarks = load_bookmarks()
        original_length = len(bookmarks)
        bookmarks = [b for b in bookmarks if b['id'] != bookmark_id]
        
        if len(bookmarks) == original_length:
            return jsonify({'error': 'Bookmark nicht gefunden'}), 404
        
        save_bookmarks(bookmarks)
        return jsonify({'message': 'Bookmark erfolgreich gelöscht'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health Check (wichtig für Railway)
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'bookmarks_count': len(load_bookmarks())
    }), 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'Favoriten API läuft',
        'endpoints': {
            'GET /api/bookmarks': 'Alle Bookmarks abrufen',
            'POST /api/bookmarks': 'Neues Bookmark hinzufügen',
            'DELETE /api/bookmarks/<id>': 'Bookmark löschen',
            'GET /health': 'Health Check'
        }
    }), 200
    
    # Port von Umgebungsvariable (wichtig für Railway)
 from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# 📄 Route: Frontend ausliefern
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

# 📂 Statische Dateien (CSS, JS)
@app.route('/<path:path>')
def serve_static_files(path):
    frontend_path = os.path.join('../frontend', path)
    if os.path.exists(frontend_path):
        return send_from_directory('../frontend', path)
    else:
        return "404 Not Found", 404

# 🧠 Beispiel-API
@app.route('/api/hello')
def hello():
    return {"message": "Hello from Flask backend!"}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
