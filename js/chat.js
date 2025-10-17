const chatContent = document.getElementById('chat-content');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

let chatMessagesData = JSON.parse(localStorage.getItem('chatMessages') || '[]');

function renderMessages() {
    chatMessages.innerHTML = '';
    chatMessagesData.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.userId === parseInt(localStorage.getItem('userId')) ? 'sent' : 'received'}`;
        msgDiv.textContent = `${msg.content} - ${msg.username} (${new Date(msg.date).toLocaleTimeString()})`;
        chatMessages.appendChild(msgDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (localStorage.getItem('loggedIn') !== 'true') {
    chatContent.innerHTML = '<p>Please log in to chat.</p>';
} else {
    renderMessages();
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value.trim()) {
        fetchJSON('data/users.json').then(users => {
            const user = users.find(u => u.id === parseInt(localStorage.getItem('userId')));
            const newMessage = {
                userId: user.id,
                username: user.name,
                content: chatInput.value,
                date: new Date().toISOString()
            };
            chatMessagesData.push(newMessage);
            localStorage.setItem('chatMessages', JSON.stringify(chatMessagesData));
            chatInput.value = '';
            renderMessages();
        });
    }
});