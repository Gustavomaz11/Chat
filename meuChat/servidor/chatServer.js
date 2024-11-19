const WebSocket = require('ws');

class ChatServer {
  constructor() {
    this.server = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });
    this.clients = new Set();
    this.setupServer();
  }

  setupServer() {
    this.server.on('connection', (ws) => {
      console.log('Novo cliente conectado');

      // Adiciona cliente à lista
      this.clients.add(ws);

      // Se houver mais de um cliente, habilita comunicação
      if (this.clients.size === 2) {
        this.setupCommunication();
      } else {
        ws.send(
          JSON.stringify({
            tipo: 'sistema',
            mensagem: 'Aguardando outro usuário...',
          }),
        );
      }

      // Configura tratamento de mensagens
      ws.on('message', (mensagemRaw) => {
        const mensagem = JSON.parse(mensagemRaw);
        this.broadcast(mensagem, ws);
      });

      // Tratamento de desconexão
      ws.on('close', () => {
        console.log('Cliente desconectado');
        this.clients.delete(ws);
        this.broadcastDisconnection();
      });
    });

    console.log('Servidor de chat iniciado na porta 8080');
  }

  setupCommunication() {
    const [cliente1, cliente2] = Array.from(this.clients);
    cliente1.send(
      JSON.stringify({
        tipo: 'sistema',
        mensagem: 'Outro usuário conectado! Pode começar a conversar.',
      }),
    );
    cliente2.send(
      JSON.stringify({
        tipo: 'sistema',
        mensagem: 'Outro usuário conectado! Pode começar a conversar.',
      }),
    );
  }

  broadcast(mensagem, remetente) {
    for (const cliente of this.clients) {
      if (cliente !== remetente && cliente.readyState === WebSocket.OPEN) {
        cliente.send(JSON.stringify(mensagem));
      }
    }
  }

  broadcastDisconnection() {
    for (const cliente of this.clients) {
      cliente.send(
        JSON.stringify({
          tipo: 'sistema',
          mensagem: 'O outro usuário desconectou.',
        }),
      );
    }
  }
}

// Inicia o servidor
new ChatServer();
