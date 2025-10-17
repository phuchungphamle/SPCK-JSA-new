function fetchJSON(path) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);

    return fetch(path)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            return { posts: [], users: [] }; // Fallback data
        })
        .finally(() => {
            document.body.removeChild(loader);
        });
}

document.querySelectorAll('.skeleton').forEach(el => el.style.display = 'none');