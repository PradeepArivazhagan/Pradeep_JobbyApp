import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="homeMainContainer">
      <div className="homeTextContainer">
        <h1 className="homeTitle">Find The Job That Fits Your Life</h1>
        <p className="homeDescription">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="linkStyle">
          <button type="button" className="findBtnStyle">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
