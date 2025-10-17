const detailContent = document.getElementById('detail-content');
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

function showError(message) {
    detailContent.innerHTML = `<p>${message}</p><a href="index.html">Back to Home</a>`;
}

if (!postId || isNaN(postId)) {
    showError('Invalid post ID.');
} else {
    Promise.all([fetchJSON('data/posts.json'), fetchJSON('data/users.json')])
        .then(([postsData, usersData]) => {
            const post = postsData.posts.find(p => p.id === parseInt(postId));
            const author = usersData.find(u => u.id === post.authorId);

            if (!post || !author) {
                showError('Post not found.');
                return;
            }

            detailContent.innerHTML = `
                <div class="breadcrumb">
                    <a href="index.html">Home</a> → 
                    <span>${post.tags[0]}</span> → 
                    <span>${post.content.substring(0, 20)}...</span>
                </div>
                <div class="post-detail">
                    <img src="${post.avatar}" alt="${post.authorName}" class="avatar">
                    <h2>${post.authorName}</h2>
                    <p class="timestamp">${post.createdAt}</p>
                    <div class="post-images">
                        ${post.images.map(img => `<img src="${img}.jpg" alt="Post image" class="detail-image">`).join('')}
                    </div>
                    <p class="content">${post.content}</p>
                    <div class="tags">${post.tags.map(tag => `<span>${tag}</span>`).join(' ')}</div>
                    <p>Likes: ${post.likes}</p>
                    <div class="comments-section">
                        <h3>Comments (${post.commentsCount})</h3>
                        <div id="comments-list"></div>
                        <form id="comment-form" style="display: ${localStorage.getItem('loggedIn') === 'true' ? 'block' : 'none'}">
                            <textarea id="comment-input" placeholder="Add a comment..."></textarea>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    <div class="related-posts" id="related-posts"></div>
                    <div class="actions">
                        <button id="save-btn">Save Post</button>
                        <button id="share-btn">Share</button>
                    </div>
                </div>
            `;

            // Load comments from localStorage
            let myComments = JSON.parse(localStorage.getItem('myComments') || '[]');
            const commentsList = document.getElementById('comments-list');
            const commentForm = document.getElementById('comment-form');
            const commentInput = document.getElementById('comment-input');
            const comments = myComments.filter(c => c.postId === post.id);

            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.textContent = `${comment.content} - ${comment.date}`;
                commentsList.appendChild(commentDiv);
            });

            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (commentInput.value.trim()) {
                    const newComment = {
                        postId: post.id,
                        userId: 5, // currentUser
                        content: commentInput.value,
                        date: new Date().toLocaleString()
                    };
                    myComments.push(newComment);
                    localStorage.setItem('myComments', JSON.stringify(myComments));
                    commentInput.value = '';
                    location.reload();
                }
            });

            // Related posts
            const relatedPosts = postsData.posts.filter(p =>
                p.id !== post.id && (p.tags.some(t => post.tags.includes(t)) || p.authorId === post.authorId)
            ).slice(0, 6) || postsData.posts.sort(() => 0.5 - Math.random()).slice(0, 6);
            const relatedSection = document.getElementById('related-posts');
            relatedPosts.forEach(p => {
                const link = document.createElement('a');
                link.href = `post-detail.html?id=${p.id}`;
                link.textContent = p.content.substring(0, 20) + '...';
                relatedSection.appendChild(link);
            });

            // Actions
            const saveBtn = document.getElementById('save-btn');
            let savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
            saveBtn.textContent = savedPosts.includes(post.id) ? 'Unsave Post' : 'Save Post';
            saveBtn.addEventListener('click', () => {
                const index = savedPosts.indexOf(post.id);
                if (index > -1) {
                    savedPosts.splice(index, 1);
                    saveBtn.textContent = 'Save Post';
                } else {
                    savedPosts.push(post.id);
                    saveBtn.textContent = 'Unsave Post';
                }
                localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
            });

            const shareBtn = document.getElementById('share-btn');
            shareBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            });
        })
        .catch(error => {
            showError('Error loading post details. Please try again later.');
        })
        .finally(() => {
            document.querySelector('.skeleton').style.display = 'none';
        });
}