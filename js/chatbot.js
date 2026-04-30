document.addEventListener('DOMContentLoaded', function () {
    var data = window.LEGASIS_CHATBOT_DATA;
    if (!data) {
        console.warn('Chatbot: LEGASIS_CHATBOT_DATA bulunamadı.');
        return;
    }

    var chatbotToggle = document.getElementById('chatbotToggle');
    var chatbotWindow = document.getElementById('chatbotWindow');
    var chatMessages = document.getElementById('chatMessages');
    var messageInput = document.getElementById('messageInput');
    if (!chatbotToggle || !chatbotWindow || !chatMessages || !messageInput) return;

    var isOpen = false;
    var welcomeSent = false;

    chatbotToggle.addEventListener('click', function () {
        isOpen = !isOpen;
        chatbotWindow.classList.toggle('active', isOpen);
        chatbotToggle.classList.toggle('active', isOpen);

        if (isOpen) {
            if (!welcomeSent) {
                welcomeSent = true;
                addMessage('bot', data.welcome.text, data.welcome.quickReplies);
            }
            setTimeout(function () { messageInput.focus(); }, 120);
        }
    });

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    }

    function sendMessage() {
        var message = messageInput.value.trim();
        if (!message) return;

        addMessage('user', message);
        messageInput.value = '';
        messageInput.focus();

        showTypingIndicator();

        setTimeout(function () {
            hideTypingIndicator();
            var response = getResponse(message);
            if (response.action) executeAction(response.action);
            addMessage('bot', response.text, response.quickReplies);
        }, 800 + Math.random() * 600);
    }

    function sendQuickReply(message) {
        addMessage('user', message);

        var direct = data.responses[message];
        if (direct && direct.action) {
            executeAction(direct.action);
        }

        showTypingIndicator();

        setTimeout(function () {
            hideTypingIndicator();
            var response = getResponse(message);
            addMessage('bot', response.text, response.quickReplies);
        }, 600 + Math.random() * 400);
    }

    function addMessage(sender, text, quickReplies) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + sender;

        var bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        var formatted = text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        bubbleDiv.innerHTML = formatted;
        messageDiv.appendChild(bubbleDiv);

        if (quickReplies && sender === 'bot') {
            var repliesDiv = document.createElement('div');
            repliesDiv.className = 'quick-replies';
            quickReplies.forEach(function (reply) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'quick-reply';
                btn.textContent = reply;
                btn.addEventListener('click', function () { sendQuickReply(reply); });
                repliesDiv.appendChild(btn);
            });
            messageDiv.appendChild(repliesDiv);
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        var typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';

        var bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';

        var indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'typing-indicator';

        for (var i = 0; i < 3; i++) {
            var dot = document.createElement('div');
            dot.className = 'typing-dot';
            indicatorDiv.appendChild(dot);
        }

        bubbleDiv.appendChild(indicatorDiv);
        typingDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        var el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function getResponse(message) {
        if (data.responses[message]) {
            return data.responses[message];
        }

        var lower = message.toLowerCase();

        for (var i = 0; i < data.keywords.length; i++) {
            var rule = data.keywords[i];
            var matched = rule.patterns.some(function (p) {
                return lower.includes(p);
            });
            if (matched) {
                if (rule.response && data.responses[rule.response]) {
                    return data.responses[rule.response];
                }
                return { text: rule.text, quickReplies: rule.quickReplies };
            }
        }

        return data.defaultResponse;
    }

    function executeAction(action) {
        if (action === 'openDemoForm') {
            var demoBtn = document.querySelector('[data-demo-open]');
            if (demoBtn) demoBtn.click();
        }
    }

    window.handleKeyPress = handleKeyPress;
    window.sendMessage = sendMessage;
    window.sendQuickReply = sendQuickReply;

    setTimeout(function () {
        if (!isOpen) {
            chatbotToggle.style.animation = 'chatbotPulse 1.5s infinite';
            setTimeout(function () {
                chatbotToggle.style.animation = 'chatbotPulse 3s infinite';
            }, 4000);
        }
    }, 5000);
});
