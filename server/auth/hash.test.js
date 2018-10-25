import { verify } from './hash'

test('verify: returns true for matching password', async () => {
  expect.assertions(1)

  // 'password'
  const hash = '$argon2id$v=19$m=8,t=2,p=1$yjmQK3uZ0b7oK7RqIua5Kw$rciYEEnFUlkunk09KIGN1VRVhAzWpXrDbHN+kfcUqjU'
  const actual = await verify(hash, 'password')
  expect(actual).toBe(true)
})

test('verify: returns false for non-matching password', async () => {
  expect.assertions(1)
  const actual = await verify('florfle', 'password')
  expect(actual).toBe(false)
})
