document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) window.location.href = "login.html";

    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendMessage = document.getElementById("sendMessage");

    // Load data from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let messages = data.chatMessages;
            localStorage.setItem("chatMessages", JSON.stringify(messages));

            const renderMessages = () => {
                chatMessages.innerHTML = "";
                messages.forEach(msg => {
                    const div = document.createElement("div");
                    div.className = `message ${msg.sender === currentUser ? "message-right" : "message-left"}`;
                    div.textContent = `${msg.content} (${msg.timestamp})`;
                    chatMessages.appendChild(div);
                });
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };

            renderMessages();

            sendMessage.addEventListener("click", () => {
                const content = chatInput.value.trim();
                if (content) {
                    const timestamp = new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Bangkok"
                    });
                    messages.push({ sender: currentUser, content, timestamp });
                    localStorage.setItem("chatMessages", JSON.stringify(messages));
                    chatInput.value = "";
                    renderMessages();
                }
            });

            chatInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") sendMessage.click();
            });
        })
        .catch(error => console.error('Error loading data.json:', error));
});