import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'localhost'),
      port: this.configService.get('SMTP_PORT', 1025),
      auth: this.configService.get('SMTP_USER')
        ? {
            user: this.configService.get('SMTP_USER'),
            pass: this.configService.get('SMTP_PASS'),
          }
        : undefined,
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: this.configService.get('SMTP_FROM', 'noreply@nitaclinics.com'),
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    // Mock SMS implementation
    // In production, integrate with Twilio, Infobip, etc.
    const provider = this.configService.get('SMS_PROVIDER', 'mock');
    
    if (provider === 'mock') {
      console.log(`[MOCK SMS] To: ${phone}, Message: ${message}`);
      return;
    }

    // Add actual SMS provider implementation here
    throw new Error('SMS provider not configured');
  }

  async sendWhatsApp(phone: string, message: string): Promise<void> {
    // Mock WhatsApp implementation
    // In production, integrate with WhatsApp Business API
    const provider = this.configService.get('WHATSAPP_PROVIDER', 'mock');
    
    if (provider === 'mock') {
      console.log(`[MOCK WhatsApp] To: ${phone}, Message: ${message}`);
      return;
    }

    // Add actual WhatsApp provider implementation here
    throw new Error('WhatsApp provider not configured');
  }

  // Email templates
  getAppointmentConfirmationEmail(data: {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0086c9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #0086c9; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${data.patientName},</p>
            <p>Your appointment has been booked successfully.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Doctor:</strong> ${data.doctorName}</li>
              <li><strong>Date:</strong> ${data.date}</li>
              <li><strong>Time:</strong> ${data.time}</li>
            </ul>
            <p>Please arrive 15 minutes before your scheduled appointment.</p>
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
          </div>
          <div class="footer">
            <p>Nita Clinic</p>
            <p>Kathmandu, Nepal | +977-1-XXXXXXX</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAdmissionConfirmationEmail(data: {
    name: string;
    applicationNumber: string;
    programName: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0086c9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .highlight { background: #e8f4fc; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for contacting Nita Clinic.</p>
            <div class="highlight">
              <p><strong>Application Number:</strong> ${data.applicationNumber}</p>
              <p><strong>Service:</strong> ${data.programName}</p>
            </div>
            <p>Your request has been received and is under review. You can track the status using your reference number.</p>
            <p>Our team will notify you via email with the next steps.</p>
          </div>
          <div class="footer">
            <p>Nita Clinic</p>
            <p>Support Team | info@nitaclinics.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
