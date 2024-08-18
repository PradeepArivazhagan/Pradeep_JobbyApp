import {BsStarFill} from 'react-icons/bs'
import {MdPlace} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'

import './index.css'

const SimilarJobCard = props => {
  const {similarJobDetails} = props
  const {
    similarCompanyLogoUrl,
    similarEmployementType,
    similarJobDescription,
    similarLocation,
    similarRating,
    similarTitle,
  } = similarJobDetails
  return (
    <li className="SimilarJobCardContainer">
      <div className="logoContainer">
        <img
          src={similarCompanyLogoUrl}
          alt="similar job company logo"
          className="jobCardLogo"
        />
        <div className="jobTitleContainer">
          <h1 className="jobTitle">{similarTitle}</h1>
          <div className="ratingContainer">
            <BsStarFill className="starIcon" />
            <p className="rating">{similarRating}</p>
          </div>
        </div>
      </div>
      <div className="descritionContainer">
        <h1 className="descriptionText">Description</h1>
        <p className="jobContentDetails">{similarJobDescription}</p>
        <div className="locationAndTypeContainer">
          <div className="iconAndTextContainer">
            <MdPlace className="iconStyle" />
            <p className="typeText">{similarLocation}</p>
          </div>
          <div className="iconAndTextContainer">
            <FaSuitcase className="iconStyle" />
            <p className="typeText">{similarEmployementType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
