import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

const Header = props => {
  const onClickButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <Link to="/">
          <li>Home</li>
        </Link>
        <Link to="/jobs">
          <li>Jobs</li>
        </Link>
        <button type="button" onClick={onClickButton}>
          Logout
        </button>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
