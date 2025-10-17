let bookmarks = [];

function loadBookmarks() {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
        bookmarks = JSON.parse(saved);
    }
    displayBookmarks();
}

function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function addBookmark() {
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();

    if (!title || !url) {
        alert('Bitte fÃ¼lle beide Felder aus!');
        return;
    }

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
    }

    bookmarks.push({
        id: Date.now(),
        title: title,
        url: finalUrl
    });

    saveBookmarks();
    displayBookmarks();

    document.getElementById('title').value = '';
    document.getElementById('url').value = '';
}

function deleteBookmark(id) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks();
    displayBookmarks();
}

function displayBookmarks() {
    const container = document.getElementById('bookmarks');
    
    if (bookmarks.length === 0) {
        container.innerHTML = '<div class="empty-state">Noch keine Favoriten gespeichert. FÃ¼ge deinen ersten Favoriten hinzu!</div>';
        return;
    }

    container.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-card">
            <div class="bookmark-title">${bookmark.title}</div>
            <a href="${bookmark.url}" target="_blank" class="bookmark-url">${bookmark.url}</a>
            <button class="delete-btn" onclick="deleteBookmark(${bookmark.id})">LÃ¶schen</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('title').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addBookmark();
    });

    document.getElementById('url').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addBookmark();
    });

    loadBookmarks();
});