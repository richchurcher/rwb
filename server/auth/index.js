/**
 * @module auth
 */

import express from 'express'

import { createJWT, createCSRFToken } from './tokens'
import { privateRoute } from './route-helpers'
import { requireParams } from '../validators'
import { USER_ATTRIBUTES_WITH_HASH } from '../users/attributes'
import { verify } from './hash'

/**
 * Verifies user credentials, then issues a JWT in an HttpOnly cookie.
 *
 * @function login
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns Either the result of the next middleware in stack, or undefined.
 */
export const login = async (req, res, next) => {
  const db = req.app.get('db')
  const { email, password } = req.body

  let user = null

  try {
    [ user ] = await db('users')
      .where({ email })
      .select(USER_ATTRIBUTES_WITH_HASH)
  } catch (e) {
    const publicError = Error('There seems to have been a problem connecting to the database.')
    publicError.type = 'database'
    return next(publicError)
  }

  if (!user) {
    return res.status(404).json({
      ok: false,
      message: "We don't recognise that user."
    })
  }

    // Don't send the hash anywhere
    const { hash, ...userDetails } = user

  try {
    if (!verify(hash, password)) {
      // Notice that we're not treating this as an error, whereas failing to
      // provide user/pass is an error. This is just the wrong password. We
      // _could_ treat it as an error, but errors aren't really for flow
      // control.
      return res.status(403).json({
        ok: false,
        message: 'Incorrect password.'
      })
    }
  } catch (e) {
    const publicError = Error('There was a problem with logging you in.')
    publicError.type = 'authentication'
    return next(publicError)
  }

  // Set the token
  const secure = process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test'
  const csrfToken = createCSRFToken()
  const jwt = createJWT(user.id, csrfToken)
  res.cookie('session', jwt, {
    httpOnly: true,
    sameSite: 'Strict',
    secure
  })

  // All ok, send the user object (minus the hash), and the CSRF token for
  // localStorage
  res.json({
    ok: true,
    csrfToken,
    user: userDetails
  })
}

/**
 * Because we have this behind a `privateRoute`, it's a cheap way to check if a
 * user has a current valid token.  If they don't, `privateRoute` won't let
 * them get to this point. If they do, they get a user object back.
 *
 * @function sessionCheck
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns Either the result of the next middleware in stack, or undefined.
 */
export const sessionCheck = (req, res) => {
  const { user } = res.locals
  return res.json({
    ok: true,
    user 
  })
}

const router = express()

router.post('/login', requireParams([ 'email', 'password' ]), login)
router.get('/sessioncheck', privateRoute, sessionCheck)

export default router
