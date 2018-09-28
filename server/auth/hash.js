/**
 * @module hash
 */

import sodium from 'sodium'

/**
 * node-sodium's password hashing doesn't include a higher-level API yet, so
 * this is the lower-level API. Note that because sodium is a CommonJS module,
 * we can't just do:
 *
 *   import { api } from 'sodium'
 *
 * @type {Object}
 * @link https://github.com/paixaop/node-sodium/blob/master/lib/sodium.js#L46-L51 API definition in source.
 */
export const verify = (hash, password) =>
  sodium.api.crypto_pwhash_str_verify(
    Buffer.from(hash, 'base64'),
    Buffer.from(password, 'utf8')
  )
