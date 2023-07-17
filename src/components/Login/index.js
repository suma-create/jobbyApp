import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', submitError: false, errorMsg: ''}

  onChangeUser = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({submitError: true, errorMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const details = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(details),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, submitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <form onSubmit={this.onSubmitLoginForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div>
            <label htmlFor="user">USERNAME</label>
            <br />
            <input
              type="text"
              onChange={this.onChangeUser}
              id="user"
              placeholder="Username"
              value={username}
            />
          </div>
          <div>
            <label htmlFor="password">PASSWORD</label>
            <br />
            <input
              type="password"
              onChange={this.onChangePassword}
              id="password"
              placeholder="Password"
              value={password}
            />
          </div>
          <button type="submit">Login</button>
          {submitError && <p>{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
