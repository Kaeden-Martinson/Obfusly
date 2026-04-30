/**
 * EmailTemplates.js
 * Email template generation for various scenarios
 */

class EmailTemplates {
  /**
   * Get email verification template
   */
  static getVerificationEmail(code, userName = 'User') {
    return {
      subject: 'Verify Your Email - Obfusly',
      text: `Your verification code is: ${code}\n\nThis code expires in 60 seconds.\n\nIf you didn't sign up, please ignore this email.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Welcome to Obfusly, ${this.escapeHtml(userName)}!</h2>
              
              <p style="color: #666; font-size: 16px;">Thank you for signing up. To complete your registration, please verify your email address using the code below:</p>
              
              <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <p style="font-size: 12px; color: #999; margin: 0 0 10px 0;">VERIFICATION CODE</p>
                <p style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 0;">${code}</p>
              </div>
              
              <p style="color: #666; font-size: 14px;">This code will expire in <strong>60 seconds</strong>.</p>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't create this account, please disregard this email.</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">© 2026 Obfusly. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Get password reset email template
   */
  static getPasswordResetEmail(code, userName = 'User') {
    return {
      subject: 'Reset Your Password - Obfusly',
      text: `Your password reset code is: ${code}\n\nThis code expires in 60 seconds.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
              
              <p style="color: #666; font-size: 16px;">Hi ${this.escapeHtml(userName)},</p>
              
              <p style="color: #666; font-size: 16px;">We received a request to reset the password for your Obfusly account. Use the code below to reset it:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 2px dashed #007bff;">
                  <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">Your reset code:</p>
                  <p style="color: #007bff; font-size: 36px; font-weight: bold; letter-spacing: 6px; margin: 0; font-family: 'Courier New', monospace;">${code}</p>
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; border-radius: 4px;">
                <strong>⏰ This code expires in 60 seconds</strong>. Enter it in the password reset form in your browser.
              </p>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. Your password has not been changed.</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">© 2026 Obfusly. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Get welcome email template (after verification)
   */
  static getWelcomeEmail(userName = 'User') {
    return {
      subject: 'Welcome to Obfusly!',
      text: `Welcome to Obfusly, ${userName}!\n\nYour account has been successfully verified. You can now start obfuscating your code.`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Welcome to Obfusly, ${this.escapeHtml(userName)}!</h2>
              
              <p style="color: #666; font-size: 16px;">Your email has been verified and your account is now active. You can start using all features of Obfusly.</p>
              
              <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #004085; margin: 0; font-weight: 500;">✓ Account verified and ready to use</p>
              </div>
              
              <h3 style="color: #333;">Get Started:</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.8;">
                <li>Navigate to the Obfuscate page to start protecting your code</li>
                <li>Try our free tier to see the power of Obfusly</li>
                <li>Upgrade to a paid plan for advanced features</li>
              </ul>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">If you have any questions, feel free to contact us at support@obfusly.com</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">© 2026 Obfusly. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Helper to escape HTML entities
   */
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

module.exports = EmailTemplates;
