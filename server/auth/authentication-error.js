/**
 * Custom auth error. Accepts a message and HTTP status.
 *
 * @extends Error
 */
class AuthenticationError extends Error {
  /**
   * @param {string} message - note that this will be exposed to the API.
   * @param {number} status - HTTP status code to issue.
   */
  constructor (message, status) {
    super(message)
    this.name = 'AuthenticationError'
    this.status = status
  }
}

export default AuthenticationError
