
document.addEventListener('DOMContentLoaded', function() {
    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const chatIcon = document.getElementById('chatIcon');
    const closeIcon = document.getElementById('closeIcon');

    let isOpen = false;

    // Knowledge base for responses
    const responses = {
        'platform nasıl çalışır': {
            text: 'DikEra AI platformu şu şekilde çalışır:\n\n1. 📄 Belgelerinizi yükleyin\n2. 🤖 Agent oluşturun\n3. ❓ Sorularınızı sorun\n4. 💡 Anında cevaplar alın\n\nPlatform, gelişmiş yapay zeka teknolojileri kullanarak hukuki metinleri analiz eder ve size özel çözümler sunar.',
            quickReplies: ['Güvenlik özellikleri', 'Desteklenen dosya türleri', 'Demo talep et']
        },
        'fiyatlandırma': {
            text: 'Fiyatlandırma paketlerimiz:\n\n🥉 **Temel Plan**: 500₺/ay\n• 1 kullanıcı\n• 10 GB depolama\n• Temel destek\n\n🥈 **Profesyonel Plan**: 1.200₺/ay\n• 5 kullanıcı\n• 50 GB depolama\n• Öncelikli destek\n\n🥇 **Kurumsal Plan**: Özel fiyat\n• Sınırsız kullanıcı\n• Özel çözümler\n• 7/24 destek',
            quickReplies: ['Demo talep et', 'Özellik karşılaştırması', 'İletişim']
        },
        'demo': {
            text: 'Demo talebiniz için teşekkürler! 🎉\n\nDemo sürecimiz:\n\n1. ✅ Talep formunu doldurur\n2. 📞 Ekibimiz 24 saat içinde arar\n3. 💻 Kişiselleştirilmiş demo sunar\n4. 🚀 Hemen kullanmaya başlarsınız\n\nDemo talebinde bulunmak için aşağıdaki butona tıklayın.',
            quickReplies: ['Demo formu doldur', 'İletişim bilgileri', 'Geri dön']
        },
        'güvenlik': {
            text: 'Güvenlik önlemlerimiz:\n\n🔐 **Şifreleme**: End-to-end şifreleme\n🏢 **İzolasyon**: Her müvekkil için ayrı güvenli alan\n🛡️ **Uyumluluk**: KVKK ve GDPR uyumlu\n📊 **Denetim**: Detaylı aktivite logları\n🔒 **Erişim**: Çok faktörlü kimlik doğrulama\n\nVerileriniz tamamen güvende!',
            quickReplies: ['Teknik detaylar', 'Sertifikalar', 'Demo talep et']
        },
        'dosya türleri': {
            text: 'Desteklenen dosya türleri:\n\n📄 **Metin**: PDF, DOC, DOCX, TXT\n📊 **Tablolar**: XLS, XLSX, CSV\n📧 **E-postalar**: MSG, EML\n🖼️ **Görseller**: JPG, PNG (OCR ile)\n📋 **Diğer**: RTF, ODT, HTML\n\nTüm dosyalar güvenli bir şekilde işlenir ve analiz edilir.',
            quickReplies: ['OCR özellikleri', 'Dosya boyutu limiti', 'Demo talep et']
        },
        'default': {
            text: 'Bu konuda detaylı bilgi veremiyorum, ancak size yardımcı olmak için elimden geleni yaparım! 😊\n\nAşağıdaki konular hakkında size bilgi verebilirim:',
            quickReplies: ['Platform özellikleri', 'Fiyatlandırma', 'Demo talep et', 'Güvenlik']
        }
    };

    // Toggle chatbot
    chatbotToggle.addEventListener('click', function() {
        isOpen = !isOpen;
        chatbotWindow.classList.toggle('active', isOpen);
        chatbotToggle.classList.toggle('active', isOpen);
        
        if (isOpen) {
            chatIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            // Add a small delay to ensure the window is visible before focusing
            setTimeout(() => {
                messageInput.focus();
            }, 100);
        } else {
            chatIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    });

    // Handle keyboard input
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
            return false;
        }
    }

    // Send message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage('user', message);
        messageInput.value = '';
        messageInput.focus(); // Keep focus for continued typing

        // Show typing indicator
        showTypingIndicator();

        // Simulate AI response delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = getResponse(message);
            addMessage('bot', response.text, response.quickReplies);
        }, 1200);
    }

    // Send quick reply
    function sendQuickReply(message) {
        addMessage('user', message);
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = getResponse(message);
            addMessage('bot', response.text, response.quickReplies);
        }, 1000);
    }

    // Add message to chat
    function addMessage(sender, text, quickReplies = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = text.replace(/\n/g, '<br>');

        messageDiv.appendChild(bubbleDiv);

        if (quickReplies && sender === 'bot') {
            const repliesDiv = document.createElement('div');
            repliesDiv.className = 'quick-replies';

            quickReplies.forEach(reply => {
                const replyButton = document.createElement('div');
                replyButton.className = 'quick-reply';
                replyButton.textContent = reply;
                replyButton.onclick = () => {
                    if (reply === 'Demo formu doldur') {
                        // Scroll to demo section
                        const demoSection = document.querySelector('#demo-section');
                        if (demoSection) {
                            demoSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        return;
                    }
                    sendQuickReply(reply);
                };
                repliesDiv.appendChild(replyButton);
            });

            messageDiv.appendChild(repliesDiv);
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            indicatorDiv.appendChild(dot);
        }
        
        bubbleDiv.appendChild(indicatorDiv);
        typingDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Get AI response - Enhanced with more keyword matching
    function getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // More comprehensive keyword matching
        if (lowerMessage.includes('platform') || lowerMessage.includes('nasıl') || lowerMessage.includes('çalış') || lowerMessage.includes('aylık') || 
            lowerMessage.includes('nedir') || lowerMessage.includes('ne işe yarar')) {
            return responses['platform nasıl çalışır'];
        } else if (lowerMessage.includes('fiyat') || lowerMessage.includes('ücret') || lowerMessage.includes('plan') || 
                    lowerMessage.includes('maliyet') || lowerMessage.includes('kaç para')) {
            return responses['fiyatlandırma'];
        } else if (lowerMessage.includes('demo') || lowerMessage.includes('deneme') || lowerMessage.includes('test') || 
                    lowerMessage.includes('dene') || lowerMessage.includes('göster')) {
            return responses['demo'];
        } else if (lowerMessage.includes('güvenlik') || lowerMessage.includes('güvenli') || lowerMessage.includes('şifre') || 
                    lowerMessage.includes('koruma') || lowerMessage.includes('veri')) {
            return responses['güvenlik'];
        } else if (lowerMessage.includes('dosya') || lowerMessage.includes('belge') || lowerMessage.includes('format') || 
                    lowerMessage.includes('yükle') || lowerMessage.includes('pdf')) {
            return responses['dosya türleri'];
        } else if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hey')) {
            return {
                text: 'Merhaba! 👋 DikEra AI platformuna hoş geldiniz! Size nasıl yardımcı olabilirim?',
                quickReplies: ['Platform özellikleri', 'Fiyatlandırma', 'Demo talep et']
            };
        } else if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağol') || lowerMessage.includes('thanks')) {
            return {
                text: 'Rica ederim! 😊 Başka sorularınız varsa her zaman buradayım. Size yardımcı olmaktan mutluluk duyarım!',
                quickReplies: ['Başka sorular', 'Demo talep et', 'İletişim']
            };
        } else if (lowerMessage.includes('iletişim') || lowerMessage.includes('telefon') || lowerMessage.includes('mail') || 
                    lowerMessage.includes('contact')) {
            return {
                text: 'İletişim bilgilerimiz:\n\n📧 **E-posta**: info@dikera.com\n📞 **Telefon**: Yakında eklenecek\n🌐 **Web**: www.dikera.com\n\n📍 **Adres**: İstanbul, Türkiye\n\nDemo talep etmek için formumuzu da kullanabilirsiniz!',
                quickReplies: ['Demo talep et', 'Geri dön', 'Sosyal medya']
            };
        } else {
            return responses['default'];
        }
    }

    // Close chatbot when clicking outside
    document.addEventListener('click', function(event) {
        const chatbot = document.querySelector('.dikera-chatbot');
        if (isOpen && !chatbot.contains(event.target)) {
            // Don't close when clicking inside chatbot
            return;
        }
    });

    // Welcome message after 3 seconds
    setTimeout(() => {
        if (!isOpen) {
            // Show a subtle notification
            const toggle = document.getElementById('chatbotToggle');
            toggle.style.animation = 'pulse 1s infinite';
            
            setTimeout(() => {
                toggle.style.animation = 'pulse 2s infinite';
            }, 3000);
        }
    }, 3000);

    // Expose functions globally so they can be called from HTML attributes
    window.handleKeyPress = handleKeyPress;
    window.sendMessage = sendMessage;
    window.sendQuickReply = sendQuickReply;
});