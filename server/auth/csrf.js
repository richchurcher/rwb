/**
 * @module csrf
 */

import AuthenticationError from './authentication-error'

/**
 * CSRF-checking middleware. Compares the X_CSRF_Token custom header to the
 * value embedded in the JWT. This satisfies both the double submit cookie
 * strategy and the custom header strategy.
 *
 * Assumes JWT has already been parsed, and user data (if any) is on
 * `res.locals.user`.
 *
 * Note also the Express request object value `req.xhr` which indicates if a
 * request was sent by a JS client library. This hasn't been used here, but it
 * can be helpful in implementing the custom header check (see doc links
 * below).
 *
 * It's important to realise that rolling your own in this kind of context is
 * usually a bad idea. Using established libraries which get thoroughly
 * scrutinised is the way to go (`csurf` is linked below). Understanding the
 * techniques, though, is never a bad thing.
 *
 * @function csrf
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns `next(Error)` if token validation fails.
 * @link https://github.com/expressjs/csurf csurf (Express CSRF middleware)
 * @link https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Double_Submit_Cookie Double submit cookie technique
 * @link https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Protecting_REST_Services:_Use_of_Custom_Request_Headers Custom header technique
 * @link http://seclab.stanford.edu/websec/csrf/csrf.pdf Robust Defenses for Cross-Site Request Forgery (2008)
 */
export default function csrf (req, res, next) {
  const headerToken = req.get('X-CSRF-Token')

  // First wall: fail if header is not present. This, by itself, is fairly
  // useful in preventing CSRF. JS must be used to add custom headers, and JS
  // should be prevented in origins
  if (!headerToken) {
    // There ought to be no need to actually log the user out here (clear the
    // JWT cookie). After all, if they're the victim of a CSRF attack we've
    // just thwarted it, and their session should be safe.
    return next(new AuthenticationError('No CSRF header.', 403))
  }

  // Second wall: fail if JWT value is not set
  const { user } = res.locals
  if (!user || !user.csrfToken) {
    return next(new AuthenticationError('No csrfToken claim.', 403))
  }

  // Third wall: fail if values do not match
  if (headerToken !== user.csrfToken) {
    return next(new AuthenticationError('CSRF token mismatch.'), 403)
  }

  // Valid request: continue
  next()
}
