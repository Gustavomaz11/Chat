// WebSocket and Chat Functionality
class ChatApplication {
    constructor() {
      this.socket = null;
      this.user = {
        name: '',
        avatar: ''
      };
      this.conversations = [];
      this.initializeEventListeners();
      this.connectWebSocket();
    }
  
    initializeEventListeners() {
      // Send message on Enter key
      document.getElementById('mensagem').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
  
      // Enhanced send button
      document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
  
      // New chat button functionality
      document.querySelector('.tituloChat button').addEventListener('click', () => {
        this.startNewChat();
      });
    }
  
    connectWebSocket() {
      this.socket = new WebSocket('ws://172.23.84.94:8080');
  
      this.socket.onopen = () => {
        this.promptUserDetails();
        this.addSystemMessage('Conectado ao servidor.');
        this.animateConnectionStatus('Conectado', 'success');
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      };
  
      this.socket.onerror = () => {
        this.addSystemMessage('Erro de conexão.');
        this.animateConnectionStatus('Erro', 'error');
      };
  
      this.socket.onclose = () => {
        this.addSystemMessage('Conexão fechada.');
        this.animateConnectionStatus('Desconectado', 'warning');
      };
    }
  
    promptUserDetails() {
      const userName = prompt('Digite seu nome:') || 'Usuário';
      const avatarUrl = prompt('URL do seu avatar (deixe em branco para padrão):') 
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=64ffda&color=0a192f`;
      
      this.user = { name: userName, avatar: avatarUrl };
      this.updateUserProfile();
    }
  
    updateUserProfile() {
      const profileElements = document.querySelectorAll('.avacartChat img, .avatarCard img');
      profileElements.forEach(el => {
        el.src = this.user.avatar;
        el.alt = this.user.name;
      });
  
      document.querySelector('#chat nav h2').textContent = this.user.name;
    }
  
    sendMessage() {
      const messageInput = document.getElementById('mensagem');
      const message = messageInput.value.trim();
  
      if (message && this.socket) {
        const messageData = {
          tipo: 'usuario',
          mensagem: message,
          nomeUsuario: this.user.name,
          avatarUsuario: this.user.avatar
        };
  
        this.socket.send(JSON.stringify(messageData));
        this.addMessageToChatBox('usuario', message, this.user.name, this.user.avatar);
        messageInput.value = '';
        this.scrollToBottom();
      }
    }
  
    handleIncomingMessage(data) {
      this.addMessageToChatBox(
        data.tipo, 
        data.mensagem, 
        data.nomeUsuario || 'Usuário', 
        data.avatarUsuario || this.generateDefaultAvatar(data.nomeUsuario)
      );
  
      // Desktop notification
      this.sendDesktopNotification(data.nomeUsuario, data.mensagem);
    }
  
    addMessageToChatBox(type, message, senderName, avatarUrl) {
      const chatBox = document.getElementById('caixa-chat');
      const messageElement = document.createElement('div');
      messageElement.classList.add('mensagem', type === 'sistema' ? 'system-message' : 'user-message');
  
      messageElement.innerHTML = type === 'sistema' 
        ? `
          <img src="/sistema-icon.png" class="avatar" alt="Sistema">
          <div class="mensagem-texto system">
            <em>${message}</em>
          </div>
        `
        : `
          <img src="${avatarUrl}" class="avatar" alt="${senderName}">
          <div class="mensagem-texto">
            <strong>${senderName}:</strong> ${this.formatMessageContent(message)}
          </div>
        `;
  
      chatBox.appendChild(messageElement);
      this.scrollToBottom();
    }
  
    formatMessageContent(message) {
      // Add basic markdown-like formatting
      return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>');
    }
  
    scrollToBottom() {
      const chatBox = document.getElementById('caixa-chat');
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    sendDesktopNotification(userName, message) {
      if (Notification.permission === 'granted' && document.hidden) {
        new Notification(`Mensagem de ${userName}`, {
          body: message.length > 30 ? message.substring(0, 30) + '...' : message,
          icon: this.user.avatar
        });
      }
    }
  
    generateDefaultAvatar(name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=64ffda&color=0a192f`;
    }
  
    animateConnectionStatus(message, type) {
      const statusElement = document.createElement('div');
      statusElement.classList.add('connection-status', type);
      statusElement.textContent = message;
      
      document.getElementById('chat').prepend(statusElement);
      
      setTimeout(() => {
        statusElement.classList.add('fade-out');
        setTimeout(() => statusElement.remove(), 1000);
      }, 3000);
    }
  
    addSystemMessage(message) {
      this.addMessageToChatBox('sistema', message);
    }
  
    startNewChat() {
      // Reset chat and prompt for new user details
      document.getElementById('caixa-chat').innerHTML = '';
      this.promptUserDetails();
    }
  }
  
  // Initialize the chat application when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  
    // Create chat application instance
    window.chatApp = new ChatApplication();
  });