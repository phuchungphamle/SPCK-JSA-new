document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('error-message');

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = 'Password must be at least 8 characters long and include at least one letter, one number, and one special character (@$!%*#?&).';
        return;
    }
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }

    fetchJSON('data/users.json').then(data => {
        if (data.some(u => u.name === username)) {
            errorMessage.textContent = 'Username already exists.';
        } else {
            const newUser = {
                id: data.length + 1,
                name: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                avatar: `image/JSA img ${data.length + 1}.jpg`,
                password: password
            };
            data.push(newUser);
            fetch('data/users.json', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(() => {
                errorMessage.textContent = 'Signup successful! Please log in.';
                errorMessage.style.color = 'green';
                setTimeout(() => window.location.href = 'login.html', 2000);
            }).catch(() => {
                errorMessage.textContent = 'Error during signup. Please try again.';
            });
        }
    });
});