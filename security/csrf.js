/**
 * Utility to generate tokens
 */

// Generates a strong CSRF token
const crypto = require('crypto');
exports.generateCsrfToken = () =>{
    return crypto.randomBytes(24).toString('hex')
}