document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) window.location.href = "login.html";

    const userName = document.getElementById("userName");
    const profileUsername = document.getElementById("profileUsername");
    const profileName = document.getElementById("profileName");
    const postCount = document.getElementById("postCount");
    const followerCount = document.getElementById("followerCount");
    const followingCount = document.getElementById("followingCount");
    const profilePosts = document.getElementById("profilePosts");

    if (userName) userName.textContent = currentUser;
    if (profileUsername) profileUsername.textContent = currentUser;
    if (profileName) profileName.textContent = `${currentUser}'s Profile`;
    if (postCount) postCount.textContent = "5";
    if (followerCount) followerCount.textContent = "150";
    if (followingCount) followingCount.textContent = "100";

    // Load data from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const posts = data.posts;

            const showSkeleton = (show) => {
                const skeleton = document.getElementById("skeleton");
                if (skeleton) skeleton.style.display = show ? "flex" : "none";
            };

            showSkeleton(true);
            const userPosts = posts.filter(post => post.username === currentUser).slice(0, 12);
            userPosts.forEach(post => {
                const div = document.createElement("div");
                div.className = "postcard";
                div.innerHTML = `
                    <div class="post-header">${post.username} <span class="timestamp">${post.timestamp}</span></div>
                    <div class="post-content">${post.content}</div>
                    <div class="reaction-bar">
                        <div class="reaction-icons">
                            <i class="fas fa-heart" onclick="likePost(${post.id})"></i>
                            <i class="fas fa-comment"></i>
                            <i class="fas fa-share"></i>
                        </div>
                        <div class="like-count">${post.likes} likes</div>
                    </div>
                `;
                profilePosts.appendChild(div);
            });
            showSkeleton(false);
        })
        .catch(error => console.error('Error loading data.json:', error));

    window.likePost = (id) => {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const allPosts = data.posts;
                const post = allPosts.find(p => p.id === id);
                if (post) {
                    post.likes += 1;
                    localStorage.setItem("posts", JSON.stringify(allPosts));
                    location.reload();
                }
            })
            .catch(error => console.error('Error updating like:', error));
    };
});