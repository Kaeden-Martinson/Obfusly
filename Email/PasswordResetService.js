/**
 * PasswordResetService.js
 * Handles password reset tokens and recovery emails
 */

const crypto = require('crypto');
const emailService = require('./EmailService');
const EmailTemplates = require('./EmailTemplates');

/**
 * In-memory storage for reset tokens
 * For production, use database instead
 * Structure: {
 *   'reset_email@example.com': {
 *     token: 'abc123...',
 *     expiresAt: timestamp
 *   }
 * }
 */
const resetStore = {};

class PasswordResetService {
  /**
   * Generate a secure reset token (32-character hex string)
   */
  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Send password reset email with recovery link
   * @param {string} email - User's email address
   * @param {string} userName - User's name
   * @param {string} resetUrl - Full reset URL (e.g., https://obfusly.com/reset-password?token=xxx)
   * @returns {Promise} Result with {success, token, message, expiresIn, error}
   */
  static async sendPasswordResetEmail(email, userName = 'User', resetUrl) {
    const token = this.generateToken();
    const expiresIn = 60 * 60 * 1000; // 1 hour
    const expiresAt = Date.now() + expiresIn;

    // Store reset token
    resetStore[`reset_${email}`] = {
      token,
      expiresAt,
    };

    const template = EmailTemplates.getPasswordResetEmail(resetUrl, userName);

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
        token,
        message: 'Password reset email sent',
        expiresIn: Math.floor(expiresIn / 1000), // seconds
      };
    } else {
      delete resetStore[`reset_${email}`];
      return {
        success: false,
        error: result.error,
      };
    }
  }

  /**
   * Verify password reset token
   * @param {string} email - User's email
   * @param {string} token - Reset token from URL
   * @returns {boolean} True if token is valid and not expired
   */
  static verifyResetToken(email, token) {
    const reset = resetStore[`reset_${email}`];

    if (!reset) {
      return false;
    }

    // Check if expired
    if (Date.now() > reset.expiresAt) {
      delete resetStore[`reset_${email}`];
      return false;
    }

    // Verify token
    if (reset.token !== token) {
      return false;
    }

    // Token is valid, remove from store
    delete resetStore[`reset_${email}`];
    return true;
  }

  /**
   * Get reset info (for debugging)
   * @private
   */
  static getResetInfo(email) {
    return resetStore[`reset_${email}`] || null;
  }

  /**
   * Clear all resets (for testing)
   * @private
   */
  static clearAll() {
    Object.keys(resetStore).forEach(key => {
      if (key.startsWith('reset_')) {
        delete resetStore[key];
      }
    });
  }
}

module.exports = PasswordResetService;
