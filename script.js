// Chat Terminal and Tab Management
class HomepageApp {
    constructor() {
        this.currentTab = 'about';
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.isTyping = false;
        this.chatHistory = [];
        
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupChatInterface();
        this.startWelcomeMessage();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const contentPanels = document.querySelectorAll('.content-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content panel
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');

        this.currentTab = tabName;
    }

    setupChatInterface() {
        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-focus input
        this.chatInput.focus();
    }

    startWelcomeMessage() {
        setTimeout(() => {
            this.addBotMessage('Welcome to Zikai Zhang\'s homepage! 👋\n\nI\'m an AI assistant that can help you learn about Zikai\'s research in Federated Learning, AI Safety, and Computer Vision.\n\nFeel free to ask me anything about his work, publications, or background!', true);
        }, 1000);
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addUserMessage(message);
        
        // Clear input
        this.chatInput.value = '';
        
        // Generate and send bot response
        setTimeout(() => {
            this.generateBotResponse(message);
        }, 500);
    }

    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="user-name">You</span>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
            <div class="message-content">
                <span class="prompt">$</span>${this.escapeHtml(message)}
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message, isTyping = false) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        
        if (isTyping) {
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="bot-name">Zikai AI</span>
                    <span class="message-time">${this.getCurrentTime()}</span>
                </div>
                <div class="message-content">
                    <span class="prompt">$</span>
                    <span class="typing-animation">
                        <span class="cursor">|</span>
                    </span>
                </div>
            `;
            this.chatMessages.appendChild(messageElement);
            this.scrollToBottom();
            
            // Type the message
            this.typeMessage(messageElement, message);
        } else {
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="bot-name">Zikai AI</span>
                    <span class="message-time">${this.getCurrentTime()}</span>
                </div>
                <div class="message-content">
                    <span class="prompt">$</span>${this.escapeHtml(message)}
                </div>
            `;
            this.chatMessages.appendChild(messageElement);
            this.scrollToBottom();
        }
    }

    typeMessage(messageElement, text) {
        this.isTyping = true;
        const contentElement = messageElement.querySelector('.message-content');
        const typingElement = messageElement.querySelector('.typing-animation');
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                if (text[i] === '\n') {
                    typingElement.innerHTML += '<br>';
                } else {
                    typingElement.innerHTML += text[i];
                }
                i++;
                this.scrollToBottom();
            } else {
                clearInterval(typeInterval);
                this.isTyping = false;
                // Remove typing animation and add final text
                contentElement.innerHTML = `<span class="prompt">$</span>${this.escapeHtml(text)}`;
                this.scrollToBottom();
            }
        }, 30);
    }

    generateBotResponse(userMessage) {
        const response = this.getChatResponse(userMessage);
        this.addBotMessage(response, true);
    }

    getChatResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Research-related responses
        if (lowerMessage.includes('federated') || lowerMessage.includes('federation')) {
            return 'Federated Learning is a distributed machine learning approach where multiple clients train a shared model while keeping their data local. Zikai\'s research focuses on:\n\n• Efficient LoRA allocation for heterogeneous clients\n• Foundation model fine-tuning in federated settings\n• Optimizing communication and computation efficiency\n\nHis recent work includes "Fed-HeLLo" which addresses efficient federated fine-tuning with heterogeneous LoRA allocation.';
        }
        
        if (lowerMessage.includes('ai safety') || lowerMessage.includes('safety')) {
            return 'AI Safety is a crucial area of Zikai\'s research, focusing on:\n\n• Detecting backdoor attacks in federated learning\n• Developing robust defense mechanisms\n• Ensuring AI systems are secure and reliable\n\nHis work on "Detecting Backdoor Attacks in Federated Learning via Direction Alignment Inspection" (CVPR 2025) demonstrates innovative approaches to identifying malicious behavior in distributed learning systems.';
        }
        
        if (lowerMessage.includes('computer vision') || lowerMessage.includes('vision')) {
            return 'Computer Vision applications in Zikai\'s research include:\n\n• Smart grid monitoring and optimization\n• Cyber-physical systems analysis\n• Pattern recognition for infrastructure\n\nHis survey paper "Federated Learning for Smart Grid: A Survey on Applications and Potential Vulnerabilities" (ACM TCPS 2025) explores how computer vision and federated learning can be applied to smart grid systems.';
        }
        
        // Publication-related responses
        if (lowerMessage.includes('publication') || lowerMessage.includes('paper') || lowerMessage.includes('research')) {
            return 'Zikai has several recent publications in top-tier venues:\n\n📄 **ACM TCPS 2025**: "Federated Learning for Smart Grid: A Survey on Applications and Potential Vulnerabilities"\n📄 **IEEE TNNLS 2025**: "Fed-HeLLo: Efficient Federated Foundation Model Fine-Tuning with Heterogeneous LoRA Allocation"\n📄 **CVPR 2025**: "Detecting Backdoor Attacks in Federated Learning via Direction Alignment Inspection"\n\n📝 **Recent Preprints**:\n• "FlowerTune: A Cross-Domain Benchmark for Federated Fine-Tuning of Large Language Models" (2025)\n• "Fed-pilot: Optimizing LoRA Allocation for Efficient Federated Fine-Tuning with Heterogeneous Clients" (2024)\n\nHis work spans federated learning optimization, AI safety, and computer vision applications.';
        }
        
        // News and updates
        if (lowerMessage.includes('news') || lowerMessage.includes('update') || lowerMessage.includes('recent')) {
            return 'Recent updates from Zikai\'s research:\n\n🆕 **Latest News (2025)**:\n• New publication accepted at ACM TCPS 2025!\n• IEEE TNNLS paper on Fed-HeLLo published!\n• CVPR 2025 paper on backdoor detection accepted!\n• FlowerTune preprint on federated fine-tuning released!\n• Fed-pilot preprint on LoRA allocation published!\n\nHis research is actively contributing to the fields of federated learning and AI safety.';
        }
        
        // Preprints
        if (lowerMessage.includes('preprint') || lowerMessage.includes('draft')) {
            return 'Zikai\'s recent preprints:\n\n📝 **FlowerTune** (2025): A cross-domain benchmark for federated fine-tuning of large language models. This collaborative work provides comprehensive evaluation frameworks for federated learning systems.\n\n📝 **Fed-pilot** (2024): Optimizing LoRA allocation for efficient federated fine-tuning with heterogeneous clients. This work addresses the challenge of resource allocation in federated learning environments.\n\nBoth preprints are available and showcase innovative approaches to federated learning challenges.';
        }
        
        // Personal information
        if (lowerMessage.includes('who') || lowerMessage.includes('about') || lowerMessage.includes('background')) {
            return 'Zikai Zhang is a PhD student in Computer Science at the University of Nevada, Reno. Here\'s what you should know:\n\n• **Current Role**: PhD Student (2023-present)\n• **Research Focus**: Federated Learning, AI Safety, Computer Vision\n• **Education**: PhD at UNR, M.Eng at Huaqiao University, B.Eng at East China Jiaotong University\n• **Location**: Reno, NV, USA\n• **Pronouns**: He/Him/His\n\nHe\'s passionate about making AI systems more efficient, secure, and practical for real-world applications.';
        }
        
        // Contact information
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return 'You can reach Zikai through:\n\n📧 **Email**: zikaiz[at]unr[dot]edu\n🏢 **Office**: William N. Pennington Engineering Building (WPEB) 402\n📍 **Address**: 1664 N. Virginia Street, Reno, NV 89557\n\n🔗 **Online Profiles**:\n• Google Scholar: /citations?user=Ban1y64AAAAJ\n• LinkedIn: /in/zikai-z-9852921a1\n• GitHub: /superkevingit';
        }
        
        // Education
        if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('university')) {
            return 'Zikai\'s educational background:\n\n🎓 **PhD in Computer Science** (2023-present)\n   University of Nevada, Reno\n\n🎓 **M.Eng in Computer Science** (2018-2021)\n   Huaqiao University\n\n🎓 **B.Eng in Mechanical Engineering** (2014-2018)\n   East China Jiaotong University\n\nHis academic journey spans multiple disciplines, from mechanical engineering to computer science, with a focus on AI and machine learning.';
        }
        
        // Help and general responses
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you') || lowerMessage.includes('assist')) {
            return 'I can help you learn about:\n\n🔬 **Research Areas**: Federated Learning, AI Safety, Computer Vision\n📚 **Publications**: Recent papers and research contributions\n👨‍🎓 **Background**: Education, experience, and career path\n📞 **Contact**: How to reach Zikai\n🏫 **Institution**: University of Nevada, Reno details\n\nJust ask me anything about Zikai\'s work or background! You can also click the tabs above to explore different sections of his homepage.';
        }
        
        // Default response for unrecognized queries
        return 'That\'s an interesting question! While I specialize in information about Zikai\'s research in Federated Learning, AI Safety, and Computer Vision, I\'d be happy to help you explore his work.\n\nYou might want to ask about:\n• His research areas and recent publications\n• His educational background and experience\n• How to contact him\n• Specific topics like federated learning or AI safety\n\nWhat would you like to know more about?';
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new HomepageApp();
    
    // Add hover effects for glass elements
    const glassElements = document.querySelectorAll('.glass-card, .glass-header, .terminal-container');
    glassElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add typing animation to profile
    const profileTitle = document.querySelector('.profile-info h3');
    if (profileTitle) {
        const originalText = profileTitle.textContent;
        profileTitle.textContent = '';
        let i = 0;
        const typeProfile = setInterval(() => {
            if (i < originalText.length) {
                profileTitle.textContent += originalText[i];
                i++;
            } else {
                clearInterval(typeProfile);
            }
        }, 100);
    }
});

// Add some fun interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Create floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(99, 102, 241, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endY = -10;
        const duration = 3000 + Math.random() * 2000;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: `translateY(0px)`, opacity: 0 },
            { transform: `translateY(-${startY - endY}px)`, opacity: 1 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => {
            particle.remove();
        };
    }

    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Create particles on mouse move
    let mouseParticleTimeout;
    document.addEventListener('mousemove', (e) => {
        clearTimeout(mouseParticleTimeout);
        mouseParticleTimeout = setTimeout(() => {
            if (Math.random() < 0.1) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = e.clientX + 'px';
                particle.style.top = e.clientY + 'px';
                particle.style.width = '2px';
                particle.style.height = '2px';
                particle.style.background = 'rgba(139, 92, 246, 0.8)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                
                document.body.appendChild(particle);
                
                particle.animate([
                    { transform: 'scale(0)', opacity: 1 },
                    { transform: 'scale(1)', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    particle.remove();
                };
            }
        }, 100);
    });

    // Random profile image rotation effects
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        const animations = [
            'rotateClockwise',
            'rotateCounterClockwise', 
            'rotateSequence',
            'rotateWiggle',
            'rotateSpin',
            'rotateBounce'
        ];
        
        const durations = [0.8, 1.0, 1.2, 1.4, 1.6];
        
        profileImage.addEventListener('mouseenter', () => {
            // 随机选择动画效果
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            const randomDuration = durations[Math.floor(Math.random() * durations.length)];
            
            // 清除之前的动画
            profileImage.style.animation = 'none';
            profileImage.offsetHeight; // 强制重排
            
            // 应用新的动画
            profileImage.style.animation = `${randomAnimation} ${randomDuration}s ease-out`;
            
            // 动画结束后重置
            setTimeout(() => {
                profileImage.style.animation = 'none';
            }, randomDuration * 1000);
        });
    }
});