export default function (state = null, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return `${action.user.id}`

    case 'LOGIN_FAILURE':
      return null

    case 'LOGIN_PENDING':
      return 'pending'
        
    default:
      return state
  }
}
