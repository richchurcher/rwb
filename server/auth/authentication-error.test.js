import AuthenticationError from './authentication-error'

test('AuthenticationError matches the last snapshot', () => {
  expect(new AuthenticationError('Uh-oh', 403)).toMatchSnapshot()
})
