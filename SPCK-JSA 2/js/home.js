document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) window.location.href = "login.html";

    const userName = document.getElementById("userName");
    if (userName) userName.textContent = currentUser;

    // Load data from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const posts = data.posts;
            localStorage.setItem("posts", JSON.stringify(posts));

            const postFeed = document.getElementById("postFeed");
            const loadMore = document.getElementById("loadMore");
            let currentPage = 0;
            const itemsPerPage = 6;

            const showSkeleton = (show) => {
                const skeleton = document.getElementById("skeleton");
                if (skeleton) skeleton.style.display = show ? "flex" : "none";
            };

            const debounce = (func, delay) => {
                let timeout;
                return (...args) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(null, args), delay);
                };
            };

            const renderPosts = (postsToRender) => {
                postFeed.innerHTML = "";
                postsToRender.forEach(post => {
                    const div = document.createElement("div");
                    div.className = "postcard";
                    let imageHTML = '';
                    post.image.forEach(img => {
                        imageHTML += `<img src="${img}" alt="${post.content}" class="post-image" />`;
                    });
                    div.innerHTML = `
                        <div class="post-header">${post.username} <span class="timestamp">${post.timestamp}</span></div>
                        <div class="post-content">${post.content}</div>
                        <div class="image-gallery">${imageHTML}</div>
                        <div class="reaction-bar">
                            <div class="reaction-icons">
                                <i class="fas fa-heart" onclick="likePost(${post.id})"></i>
                                <i class="fas fa-comment"></i>
                                <i class="fas fa-share"></i>
                            </div>
                            <div class="like-count">${post.likes} likes</div>
                        </div>
                    `;
                    postFeed.appendChild(div);
                });
            };

            const loadPosts = () => {
                showSkeleton(true);
                const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
                const start = currentPage * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedPosts = allPosts.slice(start, end);
                if (paginatedPosts.length > 0) {
                    renderPosts(paginatedPosts);
                    loadMore.style.display = end < allPosts.length ? "block" : "none";
                } else {
                    postFeed.innerHTML = "<div class='text-center text-muted'>No posts available</div>";
                    loadMore.style.display = "none";
                }
                showSkeleton(false);
            };

            loadMore.addEventListener("click", () => {
                currentPage++;
                loadPosts();
            });

            const searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.placeholder = "Search username or hashtag...";
            searchInput.className = "form-control mb-3";
            searchInput.style.width = "200px";
            document.getElementById("searchLink").parentNode.insertBefore(searchInput, document.getElementById("searchLink").nextSibling);

            const searchPosts = debounce((query) => {
                showSkeleton(true);
                const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
                const filteredPosts = allPosts.filter(post =>
                    post.username.toLowerCase().includes(query.toLowerCase()) ||
                    post.content.toLowerCase().includes(query.toLowerCase())
                );
                renderPosts(filteredPosts.slice(0, itemsPerPage));
                loadMore.style.display = filteredPosts.length > itemsPerPage ? "block" : "none";
                showSkeleton(false);
            }, 300);

            searchInput.addEventListener("input", (e) => searchPosts(e.target.value));

            window.likePost = (id) => {
                const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
                const post = allPosts.find(p => p.id === id);
                if (post) {
                    post.likes += 1;
                    localStorage.setItem("posts", JSON.stringify(allPosts));
                    loadPosts();
                }
            };

            loadPosts();
        })
        .catch(error => console.error('Error loading data.json:', error));
});