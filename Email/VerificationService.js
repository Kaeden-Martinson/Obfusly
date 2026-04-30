/**
 * VerificationService.js
 * Handles email verification codes for signup
 * Uses MongoDB for storage with TTL auto-deletion of expired codes
 */

const emailService = require('./EmailService');
const EmailTemplates = require('./EmailTemplates');
const db = require('../Database/users.mongo');

class VerificationService {
  /**
   * Generate a random 6-digit verification code
   */
  static generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification email with 6-digit code
   * @param {string} email - User's email address
   * @param {string} userName - User's name
   * @returns {Promise} Result with {success, message, expiresIn, error}
   */
  static async sendVerificationEmail(email, userName = 'User') {
    const code = this.generateCode();
    const expiresIn = 10 * 60 * 1000; // 10 minutes
    const expiresAt = Date.now() + expiresIn;

    // Store verification code in database
    try {
      await db.storeVerificationCode(email, code, expiresAt);
    } catch (error) {
      console.error('Failed to store verification code:', error);
      return {
        success: false,
        error: 'Failed to store verification code',
      };
    }

    const template = EmailTemplates.getVerificationEmail(code, userName);

    const result = await emailService.send({
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    if (result.success) {
      return {
        success: true,
        message: 'Verification email sent',
        expiresIn: Math.floor(expiresIn / 1000), // seconds
      };
    } else {
      // Delete code if email failed to send
      try {
        await db.deleteVerificationCode(email);
      } catch (e) {
        console.error('Failed to delete verification code:', e);
      }
      return {
        success: false,
        error: result.error,
      };
    }
  }

  /**
   * Verify the code provided by user
   * @param {string} email - User's email
   * @param {string} code - Code provided by user
   * @returns {Promise} Result with {success, message/error}
   */
  static async verifyCode(email, code) {
    try {
      const result = await db.verifyCode(email, code);
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Verification failed',
        };
      }
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        error: 'An error occurred during verification',
      };
    }
  }

  /**
   * Resend verification code
   * @param {string} email - User's email
   * @param {string} userName - User's name
   * @returns {Promise} Result with {success, expiresIn, error}
   */
  static async resendVerificationCode(email, userName = 'User') {
    // Delete old code if exists
    try {
      await db.deleteVerificationCode(email);
    } catch (error) {
      console.error('Failed to delete old verification code:', error);
    }

    // Send new verification email
    return this.sendVerificationEmail(email, userName);
  }

  /**
   * Get verification info (for debugging)
   * @private
   */
  static async getVerificationCode(email) {
    return await db.getVerificationCode(email);
  }

  /**
   * Clear all verifications (for testing/cleanup)
   * @private
   */
  static async cleanupExpiredCodes() {
    return await db.cleanupExpiredVerificationCodes();
  }
}

module.exports = VerificationService;
