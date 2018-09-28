import React, { Component } from 'react'

export default class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  componentDidMount () {
    if (!this.props.login) {
      this.props.checkSession()
    }
  }

  handleSubmit = async evt => {
    evt.preventDefault()
    this.props.login(this.state.email, this.state.password)
  }

  handleChange = evt => {
    const field = evt.target.name
    this.setState({
      [field]: evt.target.value
    })
  }

  loginForm = () => (
    <form onSubmit={this.handleSubmit}>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" onChange={this.handleChange} />

      <label htmlFor="password">Password</label>
      <input type="text" name="password" onChange={this.handleChange} />
      <input type="submit" value="Login" />
    </form>
  )

  render() {
    const { currentUser } = this.props
    switch (currentUser) {
      case null:
        return this.loginForm()

      case 'pending':
        return 'Working...'

      default:
        return 'Logout'
    }
  }
}
