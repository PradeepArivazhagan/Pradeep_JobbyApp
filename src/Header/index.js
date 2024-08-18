import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const handleLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="mainHeaderContainer">
      <Link to="/">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logoStyle"
          />
        </li>
      </Link>
      <ul className="navItemContainer">
        <Link to="/" className="linkStyle">
          <li className="navItem">Home</li>
        </Link>
        <Link to="/jobs" className="linkStyle">
          <li className="navItem">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="logoutBtnStyle" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
