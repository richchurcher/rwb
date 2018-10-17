import AuthenticationError from './authentication-error'
import csrf from './csrf'

let headers = null
let next = null
let req = null
let res = null

beforeEach(() => {
  headers = {
    'X-CSRF-Token': 'ABCDE12345'
  }
  next = jest.fn()
  req = {
    get: header => headers[header],
    user: { id: 1 }
  }
  res = { locals: { user: { csrfToken: 'ABCDE12345' } } }
})

test('csrf issues 403 if no X-CSRF-Token', () => {
  headers['X-CSRF-Token'] = undefined
  csrf(req, res, next)
  const [ actual ] = next.mock.calls[0]
  expect(actual).toBeInstanceOf(AuthenticationError)
  expect(actual.status).toBe(403)
})

test('csrf errors if no user set', () => {
  res.locals.user = undefined
  csrf(req, res, next)
  const [ actual ] = next.mock.calls[0]
  expect(actual).toBeInstanceOf(AuthenticationError)
  expect(actual.status).toBe(403)
})

test('csrf errors if user has no token value', () => {
  res.locals.user = {}
  csrf(req, res, next)
  const [ actual ] = next.mock.calls[0]
  expect(actual).toBeInstanceOf(AuthenticationError)
  expect(actual.status).toBe(403)
})

test('csrf errors if tokens do not match', () => {
  res.locals.user.csrfToken = '1111111111'
  csrf(req, res, next)
  const [ actual ] = next.mock.calls[0]
  expect(actual).toBeInstanceOf(AuthenticationError)
  expect(actual.status).toBe(403)
})

test('csrf calls next with no args if tokens match', () => {
  csrf(req, res, next)
  expect(next).toHaveBeenCalled()
  expect(next.mock.calls[0].length).toBe(0)
})
