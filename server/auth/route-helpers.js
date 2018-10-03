/**
 * @module route-helpers
 */
import jwt from 'express-jwt'

import csrf from './csrf'
import DatabaseError from '../database-error'
import { USER_ATTRIBUTES } from '../users/attributes'

const JWT_CONFIG = {
  resultProperty: 'locals.user',
  secret: process.env.JWT_SECRET
}

/**
 * Load basic user info if an id is set.
 *
 * @function loadUser
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns Either the result of the next middleware in stack, or undefined.
 */
export const loadUser = async (req, res, next) => {
  if (!res.locals.user) {
    return next()
  }

  // Notice we're not actually doing any permissions checking here... all we
  // care about is loading some user data.
  try {
    const db = req.app.get('db')
    res.locals.user = await db('users')
      .select(USER_ATTRIBUTES)
      .where('id', res.locals.user.id)
  } catch (e) {
    // Can log internal error here, but don't expose database errors to the API
    // with `next(e)`.
    return next(new DatabaseError('There was a database problem.', 500))
  }

  next()
}

/**
 * Check the token and load some user data if it's valid.
 *
 * Even if the route is not protected, it's common to need a user object if
 * they're logged in, so both public and private route definitions use
 * `loadUser`.
 *
 * Why is `publicRoute` an array? Express can deal with middleware 'chains' like
 * this in route definitions, which allows us to reduce the complexity of the
 * route making it (hopefully) easier to read. For example:
 *
 *     router.get('/:id', publicRoute, getResource('wombats'))
 *
 * This has the same effect as:
 *
 *     router.get('/:id',
 *       jwt({ credentialsRequired: false, ...JWT_CONFIG }),
 *       loadUser,
 *       getResource('wombats'))
 *
 * but is a bit easier to parse at a glance.
 *
 * This also provides a hook for anything you might want to do on every public
 * route. Examples include logging, analytics, updating a 'last seen' value,
 * etc.
 *
 * @type {Array.<function>}
 */
export const publicRoute = [
  jwt({ credentialsRequired: false, ...JWT_CONFIG }),
  loadUser
]

/**
 * Private routes check if the user is logged in (and notify via an error if
 * not) before passing control to the next middleware.
 *
 * @type {Array.<function>}
 */
export const privateRoute = [
  jwt(JWT_CONFIG),
  csrf,
  loadUser
]
