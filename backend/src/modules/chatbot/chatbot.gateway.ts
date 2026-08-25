import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chatbot',
})
export class ChatbotGateway {
  @WebSocketServer()
  server: Server;

  private conversationHistories: Map<string, ChatMessage[]> = new Map();

  constructor(private chatbotService: ChatbotService) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const history = this.conversationHistories.get(client.id) || [];
    
    // Get response from chatbot
    const response = await this.chatbotService.chat(data.message, history);
    
    // Update history
    history.push({ role: 'user', content: data.message });
    history.push({ role: 'assistant', content: response });
    
    // Keep only last 10 messages for context
    if (history.length > 20) {
      history.splice(0, 2);
    }
    
    this.conversationHistories.set(client.id, history);
    
    client.emit('response', { message: response });
  }

  @SubscribeMessage('clearHistory')
  handleClearHistory(@ConnectedSocket() client: Socket) {
    this.conversationHistories.delete(client.id);
    client.emit('historyCleared');
  }

  handleDisconnect(client: Socket) {
    this.conversationHistories.delete(client.id);
  }
}
