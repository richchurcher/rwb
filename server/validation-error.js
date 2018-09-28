/**
 * Custom validation errors. Takes a status code and message.
 *
 * @extends Error
 */
class ValidationError extends Error {
  /**
   * @param {string} message - note that this will be exposed to the API.
   * @param {number} status - HTTP status code to issue.
   */
  constructor (message, status) {
    super(message)
    this.name = 'ValidationError'
    this.status = status
  }
}

// NB: the separate export statement is a JSDoc workaround, since it doesn't
// play nicely with `export default class...`
export default ValidationError
