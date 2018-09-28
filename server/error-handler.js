/**
 * @module error-handler
 */

/**
 * Passes control down the stack if no error, otherwise responds with the
 * status code and message specified. Issues a generic response when it
 * encounters non-custom errors to avoid inadvertently leaking server details.
 *
 * @function errorHandler
 * @param {Error} err
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns Either the result of the next middleware in stack, or undefined.
 */
export default function errorHandler (err, req, res, next) {
  // Logging may already have occurred depending on Knex settings, but this
  // would also be a good spot to explicitly log problems and possibly issue
  // devops alerts (e.g. to a Slack channel, Pingdom, etc.)
  if (!err) {
    return next()
  }

  let { message, name, status } = err

  // If `status` is not set, this is probably not one of our custom errors and
  // we don't want to expose anything from it to the client. Issue a generic
  // 'WTF' error, and preferably log it.
  if (!status) {
    status = 500
    message = "We don't know what happened. Something bad. Sorry!"
    name = 'InternalError'
  }

  res.status(status).json({
    error: name,
    message
  })
}
