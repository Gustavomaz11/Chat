document.addEventListener('DOMContentLoaded', () => {
  // Criação da estrutura do chat
  const app = document.getElementById('app');

  // Sidebar
  const aside = document.createElement('aside');
  aside.innerHTML = `
    <div class="tituloChat">
      <h1>QualiCore Chat</h1>
      <button type="button" id="newChatBtn">Nova Chat</button>
    </div>
    <div id="listaDeConversas"></div>
  `;
  app.appendChild(aside);

  // Chat section
  const section = document.createElement('section');
  section.id = 'chat';
  section.innerHTML = `
    <nav>
      <div class="avacartChat">
        <img src="" alt="fotoPerfil" width="60rem" height="50rem" style="border-radius: 50%;" />
      </div>
      <h2></h2>
    </nav>
    <div id="caixa-chat"></div>
    <input type="text" id="mensagem" placeholder="Digite uma mensagem" />
    <input type="file" id="fileUpload" accept="image/*" />
    <button id="sendBtn" onclick="enviarMensagem()>Enviar</button>
  `;
  app.appendChild(section);

  // Função para atualizar lista de conversas
  const updateConversations = (conversations) => {
    const listaDeConversas = document.getElementById('listaDeConversas');
    listaDeConversas.innerHTML = ''; // Limpa as conversas existentes

    conversations.forEach((conv) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="avatarCard">
          <img src="${conv.avatar}" alt="fotoPerfil" width="60rem" height="50rem" style="border-radius: 50%;" />
        </div>
        <div class="conteudoCard">
          <h4>${conv.nome} <span>${conv.data}</span></h4>
          <p>${conv.ultimaMensagem}</p>
        </div>
      `;
      listaDeConversas.appendChild(card);
    });
  };

  // Mock de conversas iniciais
  const conversasMock = [
    {
      nome: 'Gustavo Machado',
      avatar: '../eu.jpg',
      data: '19/11/2024',
      ultimaMensagem: 'Oi, tudo bem?'
    },
    {
      nome: 'Dailanne Rodrigues',
      avatar: '../dailanne.jpg',
      data: '18/11/2024',
      ultimaMensagem: 'Precisamos discutir o projeto!'
    }
  ];

  // Atualiza as conversas ao carregar
  updateConversations(conversasMock);

  // Exemplo para atualizar o cabeçalho do chat
  const updateChatHeader = (nome, avatar) => {
    document.querySelector('.avacartChat img').src = avatar;
    document.querySelector('.avacartChat img').alt = nome;
    document.querySelector('#chat nav h2').textContent = nome;
  };

  // Atualiza cabeçalho com dados mock
  updateChatHeader('Gustavo Machado', '../eu.jpg');
});
