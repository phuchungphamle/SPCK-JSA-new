fetchJSON('data/users.json').then(data => {
    const userId = localStorage.getItem('userId');
    const user = data.find(u => u.id === parseInt(userId));
    if (user) {
        document.getElementById('profile-content').innerHTML = `
            <h2>${user.name}</h2>
            <img src="${user.avatar}" alt="${user.name}" class="avatar">
            <p>Logged in as User ID: ${user.id}</p>
            <button onclick="localStorage.removeItem('loggedIn'); window.location.href='login.html';">Logout</button>
        `;
    } else {
        document.getElementById('profile-content').innerHTML = '<p>Please log in.</p>';
    }
});