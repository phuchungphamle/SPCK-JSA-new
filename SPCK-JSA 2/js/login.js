document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const users = JSON.parse(localStorage.getItem("users") || "{}");
            const user = users[username];

            if (user && user.password === password) {
                localStorage.setItem("currentUser", username);
                alert("Login successful! Redirecting to Home...");
                window.location.href = "index.html";
            } else {
                alert("Invalid username or password.");
            }
        });
    }

    window.logout = () => {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    };
});