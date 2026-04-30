/**
 * EmailService.js
 * Low-level email sending functionality
 * Abstraction over nodemailer for sending emails
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on environment variables
   */
  initializeTransporter() {
    const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';

    switch (emailProvider.toLowerCase()) {
      case 'gmail':
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        break;

      case 'outlook':
      case 'microsoft':
        this.transporter = nodemailer.createTransport({
          service: 'outlook',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        break;

      case 'smtp':
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
        break;

      default:
        console.warn(`Unknown email provider: ${emailProvider}`);
        this.transporter = null;
    }
  }

  /**
   * Send an email
   */
  async send({ from, to, subject, text, html = null }) {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized. Check your EMAIL_PROVIDER environment variable.');
    }

    if (!from || !to || !subject || !text) {
      throw new Error('Missing required fields: from, to, subject, text');
    }

    try {
      const mailOptions = {
        from,
        to,
        subject,
        text,
      };

      if (html) {
        mailOptions.html = html;
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EMAIL] Sent to', to, '| Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      console.error('[EMAIL ERROR]', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify the transporter connection
   */
  async verify() {
    if (!this.transporter) {
      return false;
    }

    try {
      const result = await this.transporter.verify();
      console.log('[EMAIL] Configuration verified successfully');
      return result;
    } catch (error) {
      console.error('[EMAIL] Configuration verification failed:', error);
      return false;
    }
  }
}

// Singleton instance
const emailService = new EmailService();

module.exports = emailService;
