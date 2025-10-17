const feed = document.getElementById('feed');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function renderPost(post) {
    const postCard = document.createElement('div');
    postCard.className = 'postcard';
    postCard.innerHTML = `
        <div class="post-header">
            <img src="${post.avatar}" alt="${post.authorName}" class="avatar">
            <span>${post.authorName}</span>
            <span class="timestamp">${post.createdAt}</span>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="image-gallery">
            ${post.images.map(img => `<img src="${img}.jpg" alt="Post image" class="post-image">`).join('')}
        </div>
        <div class="reaction-bar">
            <span>Likes: ${post.likes}</span>
            <a href="post-detail.html?id=${post.id}" class="detail-link">View Details</a>
        </div>
    `;
    feed.appendChild(postCard);
}

function filterAndSortPosts(posts, searchTerm, sortBy) {
    let filtered = posts.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'likes') {
        filtered.sort((a, b) => b.likes - a.likes);
    }
    return filtered;
}

fetchJSON('data/posts.json').then(data => {
    let posts = data.posts;
    function updateFeed() {
        feed.innerHTML = '';
        const searchTerm = searchInput.value;
        const sortBy = sortSelect.value;
        const filteredPosts = filterAndSortPosts(posts, searchTerm, sortBy);
        if (filteredPosts.length === 0) {
            feed.innerHTML = '<p>No results found.</p>';
        } else {
            filteredPosts.forEach(renderPost);
        }
    }
    searchInput.addEventListener('input', debounce(updateFeed, 300));
    sortSelect.addEventListener('change', updateFeed);
    updateFeed();
}).catch(error => {
    feed.innerHTML = '<p>Error loading posts. Please try again later.</p>';
});