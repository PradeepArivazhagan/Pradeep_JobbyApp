import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value, isError: false})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value, isError: false})
  }

  handleLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const jwtToken = data.jwt_token
    if (response.ok === true) {
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({isError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, isError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginRouteContainer">
        <div className="loginCard">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logoStyle"
          />
          <form onSubmit={this.handleLogin} className="fromContainer">
            <label className="formLabel" htmlFor="username">
              USERNAME
            </label>
            <input
              className="formInput"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label className="formLabel" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="formInput"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
            <button type="submit" className="loginBtnStyle">
              Login
            </button>
          </form>
          {isError && <p className="errorMsg">{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login
