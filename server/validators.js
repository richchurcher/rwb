/**
 * @module validators
 */

import ValidationError from 'validation-error'

/**
 * Mandatory parameters.
 *
 * @function requireParams
 * @param {Array.<String>} params Parameter names that must be present in
 * request
 * @example
 * router.post('/:id', requireParams(['username', 'password']), login)
 * @returns Next middleware if params are present, otherwise `undefined`.
 */
export const requireParams = params => (req, res, next) => {
  const missing = params.filter(p => !req.body.hasOwnProperty(p))
  if (missing.length === 0) {
    return next()
  }
  next(new ValidationError(`Required parameters missing: ${[ ...missing ]}.`))
}
