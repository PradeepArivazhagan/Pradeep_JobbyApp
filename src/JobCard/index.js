import {Link} from 'react-router-dom'
import {BsStarFill} from 'react-icons/bs'
import {MdPlace} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <li className="jobCardContainer">
      <Link to={`/jobs/${id}`} className="linkStyle">
        <div className="logoContainer">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <hr className="hrStyle" />
        <h1 className="descriptionText">Description</h1>
        <p className="jonContent">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
