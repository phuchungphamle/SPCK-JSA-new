document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetchJSON('data/users.json').then(data => {
        const user = data.find(u => u.name === username && u.password === password);
        if (user) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userId', user.id);
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    });
});