import {Link} from 'react-router-dom'

import Header from '../Header'

const Home = props => {
  const findJobs = () => {
    const {history} = props
    history.replace('/login')
  }
  return (
    <ul>
      <Header />
      <h1>
        Find The Job That <br />
        Fits Your Life
      </h1>
      <p>
        Millions of people are searching for jobs,salary,information,company
        reviews. Find the job that fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button" onClick={findJobs}>
          Find Jobs
        </button>
      </Link>
    </ul>
  )
}

export default Home
