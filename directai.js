function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateUUID();
        sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

const sessionId = getSessionId();

const style = document.createElement('style');
style.innerHTML = `
    #chatIcon {
        position: fixed;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 160px;
        height: 160px;
        background-image: url('logo.png');
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: bounce 2s ease infinite;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(-50%) translateX(0); }
        40% { transform: translateY(-50%) translateX(-10px); }
        60% { transform: translateY(-50%) translateX(-5px); }
    }

    #chatWindow {
        display: none;
        position: fixed;
        bottom: 10px;
        left: 0;
        width: 40%;
        max-height: 80%;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        z-index: 1001;
        font-family: Arial, sans-serif;
        font-size: 16px;
    }

    #chatHeader {
        background-color: #007bff;
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #chatHeader .headerTitle {
        display: flex;
        align-items: center;
    }

    #chatHeader img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        border-radius: 4px;
        border: 2px solid white;
    }

    #chatMessages {
        padding: 15px;
        height: 500px;
        overflow-y: auto;
        font-size: 14px;
        color: #333;
    }

    #loadingSpinner {
        display: none;
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-radius: 50%;
        border-top: 4px solid #007bff;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #chatInputContainer {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ddd;
        background-color: #f9f9f9;
    }

    #chatInput {
        flex: 1;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    #sendButton {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 5px 15px;
        font-size: 14px;
        cursor: pointer;
        margin-left: 8px;
        border-radius: 4px;
    }

    .closeBtn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        font-weight: bold;
    }

    .userMessage, .botMessage {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 8px;
        line-height: 1.5;
        font-size: 15px;
    }

    .userMessage {
        background-color: #e0f7fa;
        text-align: right;
    }

    .botMessage {
        background-color: #f1f1f1;
        text-align: left;
        white-space: pre-wrap;
    }

    .botMessage a {
        color: #007bff;
        text-decoration: none;
    }

    .botMessage a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);

// Detect if device is mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Create Chat Icon
const chatIcon = document.createElement('div');
chatIcon.id = 'chatIcon';
document.body.appendChild(chatIcon);

// Mobile: Open WhatsApp link on click
if (isMobile) {
    chatIcon.addEventListener('click', () => {
        window.location.href = "https://api.whatsapp.com/send?phone=16199164630&text=Best%20monetization%20partner";
    });
} else {
    chatIcon.addEventListener('click', () => {
        chatIcon.style.display = 'none';
        chatWindow.style.display = 'block';
        initiateChat(sessionId);
    });

    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';
    chatWindow.innerHTML = `
        <div id="chatHeader">
            <div class="headerTitle">
                <img src="logo.png" alt="Rtbdemand Logo" />
                Rtbdemand Live Chat
            </div>
            <button class="closeBtn">&times;</button>
        </div>
        <div id="chatMessages"></div>
        <div id="loadingSpinner"></div>
        <div id="chatInputContainer">
            <input type="text" id="chatInput" placeholder="Type a message..." />
            <button id="sendButton">Send</button>
        </div>
    `;
    document.body.appendChild(chatWindow);

    chatWindow.querySelector('.closeBtn').addEventListener('click', closeChat);

    function closeChat() {
        chatWindow.style.display = 'none';
        chatIcon.style.display = 'block';
    }

    function initiateChat(sessionId) {
        appendMessage("Ask me anything about monetization.", "botMessage");
    }

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    sendButton.addEventListener('click', () => {
        const userText = chatInput.value.trim();
        if (userText) {
            appendMessage(userText, 'userMessage');
            chatInput.value = '';
            sendMessageToAPI(userText, sessionId);
        }
    });

    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function appendMessage(message, className) {
        const messageElement = document.createElement('div');
        messageElement.className = className;
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'block';
    }

    function hideLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    function sendMessageToAPI(text, sessionId) {
        showLoadingSpinner();
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://app.serviceclic.com/directai.php?text=${encodeURIComponent(text)}&phone_number=rtbdemand-we&ip=${sessionId}`;
        const url = proxyUrl + apiUrl;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                hideLoadingSpinner();
                if (data.answer) {
                    appendFormattedMessage(data.answer, 'botMessage');
                }
            })
            .catch(error => {
                hideLoadingSpinner();
                console.error('Error fetching API response:', error);
                appendMessage('Sorry, something went wrong.', 'botMessage');
            });
    }

    function appendFormattedMessage(message, className) {
        const messageElement = document.createElement('div');
        messageElement.className = className;

        const paragraphs = message.split('\n');
        paragraphs.forEach(paragraph => {
            const paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraph.replace(
                /(https?:\/\/[^\s]+)/g,
                '<a href="$1" target="_blank">$1</a>'
            );
            messageElement.appendChild(paragraphElement);
        });

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
