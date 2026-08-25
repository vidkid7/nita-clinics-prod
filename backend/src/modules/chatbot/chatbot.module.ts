import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotController } from './chatbot.controller';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotGateway],
  exports: [ChatbotService],
})
export class ChatbotModule {}
