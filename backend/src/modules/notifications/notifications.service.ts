import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;
  private readonly resendApiKey?: string;
  private readonly emailFrom: string;

  constructor(private configService: ConfigService) {
    this.resendApiKey = this.configService.get<string>('RESEND_API_KEY')?.trim() || undefined;
    this.emailFrom = this.configService.get('RESEND_FROM') ||
      this.configService.get('SMTP_FROM', 'info@nitaclinics.com');

    const smtpPort = Number(this.configService.get('SMTP_PORT', 465));
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure =
      this.configService.get<string>('SMTP_SECURE')?.toLowerCase() === 'true' || smtpPort === 465;

    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'localhost'),
      port: smtpPort,
      secure: smtpSecure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: smtpUser && smtpPass
        ? {
            user: smtpUser,
            pass: smtpPass,
          }
        : undefined,
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      if (this.resendApiKey) {
        await this.sendEmailViaResend(to, subject, html, this.resendApiKey);
      } else {
        await this.emailTransporter.sendMail({
          from: this.emailFrom,
          to,
          subject,
          html,
        });
        console.log(`Email sent to ${to} via SMTP`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private async sendEmailViaResend(
    to: string,
    subject: string,
    html: string,
    apiKey: string,
  ): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.emailFrom,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Resend API returned ${response.status}: ${details}`);
    }

    console.log(`Email sent to ${to} via Resend`);
  }

  async sendNewAppointmentNotification(data: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    doctorName: string;
    date: string;
    time: string;
    visitCategory?: string;
  }): Promise<void> {
    const adminEmail = this.configService.get('ADMIN_EMAIL', 'info@nitaclinics.com');
    const subjectName = data.patientName.replace(/[\r\n]+/g, ' ').trim();

    await this.sendEmail(
      adminEmail,
      `New appointment request - ${subjectName}`,
      this.getNewAppointmentNotificationEmail(data),
    );
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

  getNewAppointmentNotificationEmail(data: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    doctorName: string;
    date: string;
    time: string;
    visitCategory?: string;
  }): string {
    const patientName = escapeHtml(data.patientName);
    const patientEmail = escapeHtml(data.patientEmail);
    const patientPhone = escapeHtml(data.patientPhone);
    const doctorName = escapeHtml(data.doctorName);
    const date = escapeHtml(data.date);
    const time = escapeHtml(data.time);
    const visitCategory = escapeHtml(data.visitCategory || 'Consultation');

    return `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;line-height:1.5">
        <div style="max-width:620px;margin:24px auto;padding:0 16px">
          <div style="background:#087f9c;color:#fff;padding:22px 24px;border-radius:12px 12px 0 0">
            <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.9">Nita Clinics</div>
            <h1 style="margin:8px 0 0;font-size:24px">New appointment request</h1>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;box-shadow:0 5px 18px rgba(15,23,42,.08)">
            <p style="margin-top:0">A new appointment was booked from the website.</p>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#64748b;width:38%">Patient</td><td style="padding:8px 0"><strong>${patientName}</strong></td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0">${patientEmail}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Phone</td><td style="padding:8px 0">${patientPhone}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Doctor</td><td style="padding:8px 0">${doctorName}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Date</td><td style="padding:8px 0">${date}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Time</td><td style="padding:8px 0">${time}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Booking type</td><td style="padding:8px 0">${visitCategory}</td></tr>
            </table>
            <p style="margin-bottom:0;color:#64748b;font-size:13px">Please review and confirm this appointment from the admin panel.</p>
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
