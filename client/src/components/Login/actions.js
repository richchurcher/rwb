export const loginPending = () => ({ type: 'LOGIN_PENDING' })
export const loginFailure = () => ({ type: 'LOGIN_FAILURE' })
export const loginSuccess = user => ({ type: 'LOGIN_SUCCESS', user })

export const login = (email, password) =>
  async dispatch => {
    dispatch(loginPending())

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ email, password })
      })
      const body = await response.json()
      body.ok
        ? dispatch(loginSuccess(body.user))
        : dispatch(loginFailure(body.message))
    } catch (e) {
      dispatch(loginFailure(e.message))
    }
  }
