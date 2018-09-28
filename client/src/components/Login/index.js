import { connect } from 'react-redux'

import Login from './Login'
import { login } from './actions'

const mapStateToProps = ({ login }) => ({
  currentUser: login
})

export default connect(mapStateToProps, { login })(Login)
