/**
 * Email Module Index
 * Exports all email services for use throughout the application
 */

const EmailService = require('./EmailService');
const VerificationService = require('./VerificationService');
const PasswordResetService = require('./PasswordResetService');
const EmailTemplates = require('./EmailTemplates');

module.exports = {
  EmailService,
  VerificationService,
  PasswordResetService,
  EmailTemplates,
};
