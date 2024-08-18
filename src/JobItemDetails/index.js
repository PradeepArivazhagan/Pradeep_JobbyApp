import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill} from 'react-icons/bs'
import {MdPlace} from 'react-icons/md'
import {FaSuitcase, FaExternalLinkAlt} from 'react-icons/fa'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatusJobDetails: apiStatusConstants.initial,
    lifeAtCompanyDetails: {},
    jobDetails: {},
    skills: [],
    similarJobList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobdDetailsData = data.job_details
      const lifeAtCompanyData = data.job_details.life_at_company
      const fetchedJobDetailsData = {
        companyLogoUrl: jobdDetailsData.company_logo_url,
        companyWebsiteUrl: jobdDetailsData.company_website_url,
        employmentType: jobdDetailsData.employment_type,
        id: jobdDetailsData.id,
        jobDescription: jobdDetailsData.job_description,
        location: jobdDetailsData.location,
        packagePerAnnum: jobdDetailsData.package_per_annum,
        rating: jobdDetailsData.rating,
        title: jobdDetailsData.title,
      }
      const skillDetailsData = data.job_details.skills
      const fetchedSkillsDetails = skillDetailsData.map(eachSkills => ({
        skillImageUrl: eachSkills.image_url,
        skillName: eachSkills.name,
      }))
      const fetchedLifeAtCompanyDetails = {
        lifeDescription: lifeAtCompanyData.description,
        lifeImageUrl: lifeAtCompanyData.image_url,
      }
      const similarJobsData = data.similar_jobs
      const fetchedSimilarJobDetails = similarJobsData.map(eachSimilar => ({
        similarCompanyLogoUrl: eachSimilar.company_logo_url,
        similarEmployementType: eachSimilar.employment_type,
        similarId: eachSimilar.id,
        similarJobDescription: eachSimilar.job_description,
        similarLocation: eachSimilar.location,
        similarRating: eachSimilar.rating,
        similarTitle: eachSimilar.title,
      }))
      this.setState({
        apiStatusJobDetails: apiStatusConstants.success,
        jobDetails: fetchedJobDetailsData,
        lifeAtCompanyDetails: fetchedLifeAtCompanyDetails,
        skills: fetchedSkillsDetails,
        similarJobList: fetchedSimilarJobDetails,
      })
    } else {
      this.setState({apiStatusJobDetails: apiStatusConstants.failure})
    }
  }

  renderJobDetailsView = () => {
    const {jobDetails, skills} = this.state
    const {lifeAtCompanyDetails, similarJobList} = this.state
    const {lifeDescription, lifeImageUrl} = lifeAtCompanyDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <div className="jobMainContainer">
        <div className="jobCardContainer">
          <div className="logoContainer">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="jobCardLogo"
            />
            <div className="jobTitleContainer">
              <h1 className="jobTitle">{title}</h1>
              <div className="ratingContainer">
                <BsStarFill className="starIcon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="locationAndSalaryContainer">
            <div className="locationAndTypeContainer">
              <div className="iconAndTextContainer">
                <MdPlace className="iconStyle" />
                <p className="typeText">{location}</p>
              </div>
              <div className="iconAndTextContainer">
                <FaSuitcase className="iconStyle" />
                <p className="typeText">{employmentType}</p>
              </div>
            </div>
            <p className="salaryText">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="desscriptionAndLink">
            <h1 className="descriptionText">Description</h1>
            <a className="websitelinkStyle" href={companyWebsiteUrl}>
              Visit <FaExternalLinkAlt className="linkIcon" />
            </a>
          </div>
          <p className="jobContentDetails">{jobDescription}</p>
          <h1 className="descriptionText">Skills</h1>
          <ul className="skillsListContainer">
            {skills.map(eachSkills => (
              <li key={eachSkills.skillName} className="skillList">
                <img
                  src={eachSkills.skillImageUrl}
                  alt={eachSkills.skillName}
                  className="skillsLogo"
                />
                <p className="skillName">{eachSkills.skillName}</p>
              </li>
            ))}
          </ul>
          <div className="lifeAtCompanyContainer">
            <div>
              <h1 className="descriptionText">Life at Company</h1>
              <p className="jobContentDetails">{lifeDescription}</p>
            </div>
            <img
              src={lifeImageUrl}
              alt="life at company"
              className="lifeatImage"
            />
          </div>
        </div>
        <h1 className="similarJobsText">Similar Jobs</h1>
        <ul className="similarJobsList">
          {similarJobList.map(eachJob => (
            <SimilarJobCard
              key={eachJob.similarId}
              similarJobDetails={eachJob}
            />
          ))}
        </ul>
      </div>
    )
  }

  handleRetryJobsDetails = () => {
    this.getJobDetails()
  }

  renderJobDetailsFailure = () => (
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
        onClick={this.handleRetryJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loaderContainer">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsResult = () => {
    const {apiStatusJobDetails} = this.state

    switch (apiStatusJobDetails) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobDetailsResult()}
      </>
    )
  }
}

export default JobItemDetails
