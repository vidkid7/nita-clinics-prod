import { Controller, Post, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @Public()
  @ApiOperation({ summary: 'Send a message to the chatbot' })
  async chat(@Body() body: { message: string; history?: { role: 'user' | 'assistant'; content: string }[] }) {
    const response = await this.chatbotService.chat(body.message, body.history || []);
    return { response };
  }

  @Get('quick-responses')
  @Public()
  @ApiOperation({ summary: 'Get quick response suggestions' })
  getQuickResponses() {
    return this.chatbotService.getQuickResponses();
  }

  @Get('system-prompt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current system prompt' })
  getSystemPrompt() {
    return { prompt: this.chatbotService.getSystemPrompt() };
  }

  @Patch('system-prompt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system prompt' })
  updateSystemPrompt(@Body() body: { prompt: string }) {
    this.chatbotService.updateSystemPrompt(body.prompt);
    return { message: 'System prompt updated successfully' };
  }
}
