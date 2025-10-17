// API URL - Automatische Erkennung für lokale und Cloud-Umgebung
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : `${window.location.protocol}//${window.location.hostname}:5000/api`;

let bookmarks = [];

// Verbindungsstatus anzeigen
function showConnectionStatus(connected) {
    let statusDiv = document.getElementById('connection-status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'connection-status';
        statusDiv.className = 'connection-status';
        document.querySelector('.container').prepend(statusDiv);
    }
    
    if (connected) {
        statusDiv.className = 'connection-status status-connected';
        statusDiv.textContent = '✓ Verbunden mit Backend';
    } else {
        statusDiv.className = 'connection-status status-disconnected';
        statusDiv.textContent = '✗ Backend nicht erreichbar';
    }
}

// Bookmarks vom Backend laden
async function loadBookmarks() {
    try {
        const response = await fetch(`${API_URL}/bookmarks`);
        if (!response.ok) throw new Error('Fehler beim Laden');
        bookmarks = await response.json();
        displayBookmarks();
        showConnectionStatus(true);
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        showConnectionStatus(false);
        displayBookmarks(); // Zeigt Empty State
    }
}

// Neues Bookmark zum Backend senden
async function addBookmark() {
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();

    if (!title || !url) {
        alert('Bitte fülle beide Felder aus!');
        return;
    }

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
    }

    try {
        const response = await fetch(`${API_URL}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                url: finalUrl
            })
        });

        if (!response.ok) throw new Error('Fehler beim Hinzufügen');

        const newBookmark = await response.json();
        bookmarks.push(newBookmark);
        displayBookmarks();
        showConnectionStatus(true);

        document.getElementById('title').value = '';
        document.getElementById('url').value = '';
    } catch (error) {
        console.error('Error adding bookmark:', error);
        alert('Fehler beim Hinzufügen des Favoriten.');
        showConnectionStatus(false);
    }
}

// Bookmark löschen
async function deleteBookmark(id) {
    if (!confirm('Möchtest du diesen Favoriten wirklich löschen?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/bookmarks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Fehler beim Löschen');

        bookmarks = bookmarks.filter(b => b.id !== id);
        displayBookmarks();
        showConnectionStatus(true);
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        alert('Fehler beim Löschen des Favoriten.');
        showConnectionStatus(false);
    }
}

// Bookmarks anzeigen
function displayBookmarks() {
    const container = document.getElementById('bookmarks');
    
    if (bookmarks.length === 0) {
        container.innerHTML = '<div class="empty-state">Noch keine Favoriten gespeichert. Füge deinen ersten Favoriten hinzu!</div>';
        return;
    }

    container.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-card">
            <div class="bookmark-title">${escapeHtml(bookmark.title)}</div>
            <a href="${escapeHtml(bookmark.url)}" target="_blank" class="bookmark-url">${escapeHtml(bookmark.url)}</a>
            <button class="delete-btn" onclick="deleteBookmark(${bookmark.id})">Löschen</button>
        </div>
    `).join('');
}

// HTML escaping für Sicherheit
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('title').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addBookmark();
    });

    document.getElementById('url').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addBookmark();
    });

    loadBookmarks();
});