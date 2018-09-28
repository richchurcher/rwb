/**
 * Custom database errors. Takes a message and status code.
 *
 * @extends Error
 */
class DatabaseError extends Error {
  /**
   * @param {string} message - note that this will be exposed to the API.
   * @param {number} status - HTTP status code to issue.
   */
  constructor (message, status) {
    super(message)
    this.name = 'DatabaseError'
    this.status = status
  }
}

export default DatabaseError
