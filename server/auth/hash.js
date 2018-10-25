/**
 * @module hash
 */

import sodium from 'libsodium-wrappers'

/**
 * libsodium-wrappers provides a `ready` property whose value is a promise.
 * We need to wait for that prior to using any sodium API functions.
 *
 * @function verify
 * @param {String} hash
 * @param {String} password
 * @returns {Boolean} `true` if password correct
 * @link https://www.npmjs.com/package/libsodium-wrappers#usage-as-a-module
 */
export const verify = async (hash, password) => {
  await sodium.ready
  return sodium.crypto_pwhash_str_verify(hash, password)
}
