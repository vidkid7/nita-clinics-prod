import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationsService } from './notifications.service';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private notificationsService: NotificationsService) {}

  @Process('appointment-confirmation')
  async handleAppointmentConfirmation(job: Job) {
    const { patientEmail, patientPhone, doctorName, date, time, patientName } = job.data;

    // Send email
    const emailHtml = this.notificationsService.getAppointmentConfirmationEmail({
      patientName: patientName || 'Patient',
      doctorName,
      date,
      time,
    });
    await this.notificationsService.sendEmail(patientEmail, 'Appointment Confirmation', emailHtml);

    // Send SMS
    const smsMessage = `Your appointment with ${doctorName} is confirmed for ${date} at ${time}. - Nita Clinic`;
    await this.notificationsService.sendSMS(patientPhone, smsMessage);
  }

  @Process('appointment-confirmed')
  async handleAppointmentConfirmed(job: Job) {
    const { patientEmail, patientPhone } = job.data;

    await this.notificationsService.sendEmail(
      patientEmail,
      'Appointment Confirmed',
      '<p>Your appointment has been confirmed by our staff. See you soon!</p>',
    );

    await this.notificationsService.sendSMS(
      patientPhone,
      'Your appointment has been confirmed. See you soon! - Nita Clinic',
    );
  }

  @Process('appointment-reminder')
  async handleAppointmentReminder(job: Job) {
    const { patientEmail, patientPhone, doctorName, date, time } = job.data;

    await this.notificationsService.sendEmail(
      patientEmail,
      'Appointment Reminder',
      `<p>Reminder: You have an appointment with ${doctorName} tomorrow at ${time}.</p>`,
    );

    await this.notificationsService.sendSMS(
      patientPhone,
      `Reminder: Your appointment with ${doctorName} is tomorrow at ${time}. - Nita Clinic`,
    );
  }

  @Process('new-enquiry')
  async handleNewEnquiry(job: Job) {
    const { type, name, email, subject } = job.data;

    // Notify admin about new enquiry
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nitaclinics.com';
    await this.notificationsService.sendEmail(
      adminEmail,
      `New ${type} Enquiry: ${subject}`,
      `<p>New enquiry received from ${name} (${email})</p>
       <p>Type: ${type}</p>
       <p>Subject: ${subject}</p>`,
    );
  }

  @Process('enquiry-response')
  async handleEnquiryResponse(job: Job) {
    const { email, name, response } = job.data;

    await this.notificationsService.sendEmail(
      email,
      'Response to Your Enquiry',
      `<p>Dear ${name},</p>
       <p>Thank you for contacting Nita Clinic. Here is our response:</p>
       <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
         ${response}
       </div>
       <p>If you have any further questions, please don't hesitate to reach out.</p>`,
    );
  }
}
