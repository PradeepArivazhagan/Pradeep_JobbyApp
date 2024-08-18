import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    newProfileDetails: {},
    apiStatus: apiStatusConstants.initial,
    apiStatusJobs: apiStatusConstants.initial,
    jobs: [],
    employmentType: [],
    salaryPackage: '',
    userSearchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const fetchedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        newProfileDetails: fetchedProfileDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    const {userSearchInput, employmentType, salaryPackage} = this.state
    const employementTypeListData = employmentType.join(',')
    this.setState({apiStatusJobs: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employementTypeListData}&minimum_package=${salaryPackage}&search=${userSearchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const {jobs} = data
    if (response.ok === true) {
      const fetchedJobsList = jobs.map(eachJobs => ({
        companyLogoUrl: eachJobs.company_logo_url,
        employmentType: eachJobs.employment_type,
        id: eachJobs.id,
        jobDescription: eachJobs.job_description,
        location: eachJobs.location,
        packagePerAnnum: eachJobs.package_per_annum,
        rating: eachJobs.rating,
        title: eachJobs.title,
      }))
      this.setState({
        jobs: fetchedJobsList,
        apiStatusJobs: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatusJobs: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loaderContainer">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {newProfileDetails} = this.state
    const {profileImageUrl, name, shortBio} = newProfileDetails
    return (
      <div className="profileContainer">
        <img src={profileImageUrl} alt="profile" className="profileImage" />
        <p className="profileName">{name}</p>
        <p className="profileBio">{shortBio}</p>
      </div>
    )
  }

  handleRetry = () => {
    this.getProfile()
  }

  renderFailureView = () => (
    <div className="loaderContainer">
      <button
        type="button"
        className="retryBtnStyle"
        onClick={this.handleRetry}
      >
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobs} = this.state
    return jobs.length > 0 ? (
      <ul className="jobsList">
        {jobs.map(eachJobs => (
          <JobCard key={eachJobs.id} jobDetails={eachJobs} />
        ))}
      </ul>
    ) : (
      this.renderNoJobsFoundView()
    )
  }

  renderNoJobsFoundView = () => (
    <div className="jobFailureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="noJobsStyle"
      />
      <h1 className="failureText">No Jobs Found</h1>
      <p className="failurePara">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  handleRetryJobs = () => {
    this.getJobs()
  }

  renderJobsFailureView = () => (
    <div className="jobFailureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="noJobsStyle"
      />
      <h1 className="failureText">Oops! Something Went Wrong</h1>
      <p className="failurePara">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retryBtnStyle"
        onClick={this.handleRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderResultsProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderResultsJobs = () => {
    const {apiStatusJobs} = this.state

    switch (apiStatusJobs) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({userSearchInput: event.target.value})
  }

  enterSearchButton = () => {
    const {userSearchInput, jobs} = this.state
    const filteredJobs = jobs.filter(eachJobs =>
      eachJobs.title.toLowerCase().includes(userSearchInput.toLowerCase()),
    )
    this.setState({jobs: filteredJobs})
  }

  onChangeCheckbox = event => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, event.target.id],
      }),
      this.getJobs,
    )
  }

  onChangeRadionButton = event => {
    this.setState({salaryPackage: event.target.id}, this.getJobs)
  }

  renderEmployementList = () =>
    employmentTypesList.map(eachEmployment => (
      <li
        key={eachEmployment.employmentTypeId}
        className="emloyementItemContainer"
      >
        <input
          id={eachEmployment.employmentTypeId}
          type="checkbox"
          className="checkBoxStyle"
          onChange={this.onChangeCheckbox}
        />
        <label className="labelStyle" htmlFor={eachEmployment.employmentTypeId}>
          {eachEmployment.label}
        </label>
      </li>
    ))

  renderSalaryList = () =>
    salaryRangesList.map(eachSalary => (
      <li key={eachSalary.salaryRangeId} className="emloyementItemContainer">
        <input
          id={eachSalary.salaryRangeId}
          type="radio"
          name="option"
          className="checkBoxStyle"
          value={eachSalary.salaryRangeId}
          onChange={this.onChangeRadionButton}
        />
        <label className="labelStyle" htmlFor={eachSalary.salaryRangeId}>
          {eachSalary.label}
        </label>
      </li>
    ))

  render() {
    const {userSearchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobsMainContainer">
          <div className="jobsLeftContainer">
            {this.renderResultsProfile()}
            <hr />
            <p className="filterTitle">Type of Employement</p>
            <ul className="employementTypeList">
              {this.renderEmployementList()}
            </ul>
            <hr />
            <p className="filterTitle">Salary Range</p>
            <ul className="employementTypeList">{this.renderSalaryList()}</ul>
          </div>
          <div className="jobsRightContainer">
            <div className="searchContainer">
              <input
                type="search"
                placeholder="Search"
                className="searchInputStyle"
                value={userSearchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="searchButton"
                onClick={this.enterSearchButton}
                aria-label="search"
              >
                <BsSearch className="searchIcon" />
              </button>
            </div>
            {this.renderResultsJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
