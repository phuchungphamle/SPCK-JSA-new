document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const loginLink = navbar.querySelector('a[href="login.html"]');
    const signupLink = navbar.querySelector('a[href="signup.html"]');
    const profileLink = navbar.querySelector('a[href="profile.html"]');
    const chatLink = navbar.querySelector('a[href="chat.html"]');

    function updateNavbar() {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        if (isLoggedIn) {
            loginLink.style.display = 'none';
            signupLink.style.display = 'none';
            profileLink.style.display = 'inline-block';
            chatLink.style.display = 'inline-block';
        } else {
            loginLink.style.display = 'inline-block';
            signupLink.style.display = 'inline-block';
            profileLink.style.display = 'none';
            chatLink.style.display = 'none';
        }
    }

    // Initial update
    updateNavbar();

    // Logout functionality (assumed on profile page, but can be added here)
    profileLink.addEventListener('click', (e) => {
        if (localStorage.getItem('loggedIn') === 'true') {
            e.preventDefault();
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId');
            updateNavbar();
            window.location.href = 'index.html';
        }
    });

    // Add responsive toggle if needed (e.g., hamburger menu)
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    navbar.insertBefore(hamburger, navbar.firstChild);

    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const navLinks = navbar.querySelectorAll('a, input, select');
        navLinks.forEach(link => link.classList.toggle('active'));
    });
});