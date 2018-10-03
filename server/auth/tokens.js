/**
 * @module create-token
 */
import jsonWebToken from 'jsonwebtoken'
import sodium from 'libsodium-wrappers'

/**
 * Create a signed JWT.
 *
 * @function createToken
 * @param {string} id User ID.
 * @returns {string} Token containing ID, with 'issued at' (`iat`) claim.
 */
export const createJWT = (id, csrfToken) =>
  jsonWebToken.sign(
    {
      id,
      csrfToken
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 24 }
  )

/**
 * CSRF tokens should be generated by a cryptographically secure RNG.
 *
 * @function createCSRFToken
 * @returns {String}
 * @link https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Synchronizer_.28CSRF.29_Tokens
 */
export const createCSRFToken = async () => {
  const buf = Buffer.allocUnsafe(64)
  await sodium.ready
  sodium.api.randombytes(buf, 64)

  return buf.toString('hex')
}
