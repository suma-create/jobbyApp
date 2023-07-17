import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'

const initialState = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class AllJobs extends Component {
  state = {jobDataDetails: [], similarJobs: [], apiStatus: initialState.initial}

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: initialState.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,

        lifeAtCompany: {
          description: each.description,
          imageUrl: each.image_url,
        },
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,

        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: each.title,
      }))
      const similarJobsData = jobDetails.map(similar => ({
        companyLogoUrl: similar.company_logo_url,
        employmentType: similar.employment_type,
        id: similar.id,
        jobDescription: similar.job_description,
        location: similar.location,
        rating: similar.rating,
        title: similar.title,
      }))
      this.setState({
        apiStatus: initialState.success,
        jobDataDetails: jobDetails,
        similarJobs: similarJobsData,
      })
    } else {
      this.setState({apiStatus: initialState.failure})
    }
  }

  renderJobDetails = () => {
    const {jobDataDetails, similarJobs} = this.state
    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDataDetails[0]

      return (
        <div>
          <div>
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
              <li>
                <h1>{title}</h1>
                <p>{rating}</p>
              </li>
            </div>
            <div>
              <p>{location}</p>
              <p>{employmentType}</p>
              <p>{packagePerAnnum}</p>
            </div>
            <hr />
            <div>
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
            </div>
            <p>{jobDescription}</p>
          </div>

          <li>
            <h1>Skills</h1>
            {skills.map(each => (
              <li key={each.name}>
                <img src={each.imageUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </li>

          <div>
            <h1>Life At Company</h1>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>

          <li>
            <h1>Similar Jobs</h1>
            {similarJobs.map(each => (
              <li key={each.id}>
                <img src={each.companyLogoUrl} alt="similar job company logo" />
                <li>
                  <h1>{each.title}</h1>
                  <p>{each.rating}</p>
                </li>
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
                <hr />
                <p>{each.location}</p>
                <p>{each.employmentType}</p>
              </li>
            ))}
          </li>
        </div>
      )
    }
    return null
  }

  onRetry = () => {
    this.getJobData()
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialState.success:
        return this.renderJobDetails()
      case initialState.failure:
        return this.failureView()
      case initialState.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderView()}</div>
      </>
    )
  }
}

export default AllJobs
