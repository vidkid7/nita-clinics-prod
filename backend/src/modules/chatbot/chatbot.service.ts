import { Injectable } from '@nestjs/common';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class ChatbotService {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = `You are a helpful assistant for Nita Clinic. Your role is to help:
    
1. **Patients**: Answer questions about services, appointment booking, clinic timings, and general wellness queries.

2. **Visitors**: Provide information about specialists, diagnostics, check-up packages, health card options, and contact details.

3. **General Visitors**: Share information about clinic facilities, departments, and available support.

Guidelines:
- Be polite, professional, and empathetic
- Provide accurate information based on the context
- For appointment bookings, guide users to use the online booking system or call the reception
- If you don't know something specific, suggest contacting the relevant department
- Keep responses concise but helpful
- Don't provide medical diagnosis or treatment advice - always recommend consulting a qualified clinician

Contact Information:
- Phone: +977 1-XXXXXXX
- Email: info@nitaclinics.com
- Address: Kathmandu, Nepal

Working Hours:
- Monday to Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 4:00 PM
- Sunday: Emergency Only`;
  }

  async chat(
    message: string,
    conversationHistory: ChatMessage[] = [],
  ): Promise<string> {
    // AI assistant is intentionally disabled. We surface a friendly fallback
    // so the rest of the app (and the chat UI) keeps working without an
    // OpenAI integration. To re-enable, reintroduce the OpenAI client and
    // call it here.
    void message;
    void conversationHistory;
    return "Our AI assistant is offline right now. Please call us at 0145-92100 or use the booking form and our team will help you directly.";
  }

  async getQuickResponses(): Promise<{ question: string; answer: string }[]> {
    return [
      {
        question: 'How do I book an appointment?',
        answer: 'You can book an appointment online through our website by clicking on "Book Appointment", or call the clinic directly.',
      },
      {
        question: 'What specialists are available?',
        answer: 'We provide specialist consultations across multiple services, including general medicine, gynecology, pediatrics, diagnostics, and preventive care.',
      },
      {
        question: 'What are your working hours?',
        answer: 'We are open Monday-Friday 8:00 AM - 6:00 PM, Saturday 9:00 AM - 4:00 PM. Emergency services available on Sundays.',
      },
      {
        question: 'What services do you offer?',
        answer: 'We offer diagnostic tests, check-up packages, vaccination services, specialist consultations, and preventive healthcare plans.',
      },
    ];
  }

  updateSystemPrompt(newPrompt: string): void {
    this.systemPrompt = newPrompt;
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}
