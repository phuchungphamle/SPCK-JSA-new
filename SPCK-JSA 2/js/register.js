document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const firstname = document.getElementById("firstname").value.trim();
            const lastname = document.getElementById("lastname").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();
            const terms = document.getElementById("terms").checked;

            if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
                alert("All fields are required.");
                return;
            }
            if (!terms) {
                alert("You must agree to the terms and conditions.");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
                alert("Password must be at least 8 characters with uppercase, lowercase, and numbers.");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "{}");
            if (users[username]) {
                alert("Username already taken.");
                return;
            }

            users[username] = { firstname, lastname, username, email, password };
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registration successful! Please log in.");
            window.location.href = "login.html";
        });
    }
});