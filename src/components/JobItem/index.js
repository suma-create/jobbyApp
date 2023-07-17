import {Link} from 'react-router-dom'

const JobItemDetail = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link to={`jobs/${id}`}>
      <li>
        <div>
          <img src={companyLogoUrl} alt="company logo" />
          <div>
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
          <p>{location}</p>
          <p>{employmentType}</p>
        </div>
        <p>{packagePerAnnum}</p>
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItemDetail
