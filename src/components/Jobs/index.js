import {BsSearch} from 'react-icons/bs'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import JobItemDetail from '../JobItem'
import Header from '../Header'

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

const employeeInitialState = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const salaryInitialState = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    jobData: [],
    checkboxInput: [],
    radioInput: '',
    searchInput: '',
    apiStatus: employeeInitialState.initial,
    apiJobStatus: salaryInitialState.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: employeeInitialState.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = [await response.json()]
      const updated = data.map(each => ({
        name: each.profile_details.name,
        profileImageUrl: each.profile_details.profile_image_url,
        shortBio: each.profile_details.short_bio,
      }))
      this.setState({
        profileData: updated,
        responseSuccess: true,
        apiStatus: employeeInitialState.success,
      })
    } else {
      this.setState({apiStatus: employeeInitialState.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobStatus: salaryInitialState.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {checkboxInput, radioInput, searchInput} = this.state
    const profileUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updated = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobData: updated,
        apiJobStatus: salaryInitialState.success,
      })
    } else {
      this.setState({apiJobStatus: salaryInitialState.failure})
    }
  }

  onRadioButton = event => {
    this.setState({radioInput: event.target.id}, this.getJobDetails)
  }

  inputData = event => {
    const {checkboxInput} = this.state
    const inputs = checkboxInput.filter(each => each === event.target.id)

    if (inputs.length === 0) {
      this.setState(
        prev => ({
          checkboxInput: [...prev.checkboxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filter = checkboxInput.filter(each => each !== event.target.id)
      this.setState({checkboxInput: filter}, this.getJobDetails)
    }
  }

  profileView = () => {
    const {profileData, responseSuccess} = this.state

    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <ul>
          <img src={profileImageUrl} alt="profile" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </ul>
      )
    }
    return null
  }

  onRetry = () => {
    this.getProfileDetails()
  }

  onRetryView = () => (
    <div>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case employeeInitialState.success:
        return this.profileView()
      case employeeInitialState.failure:
        return this.onRetryView()
      case employeeInitialState.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.getJobDetails()
  }

  onRetryJobsView = () => (
    <ul>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </ul>
  )

  onGetJobsView = () => {
    const {jobData} = this.state
    const noJobs = jobData.length === 0
    return noJobs ? (
      <ul>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </ul>
    ) : (
      <ul>
        {jobData.map(each => (
          <JobItemDetail key={each.id} jobData={each} />
        ))}
      </ul>
    )
  }

  renderJobView = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case salaryInitialState.success:
        return this.onGetJobsView()
      case salaryInitialState.failure:
        return this.onRetryJobsView()
      case salaryInitialState.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  checkboxView = () => (
    <ul>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            type="checkbox"
            onChange={this.inputData}
            id={each.employmentTypeId}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  radioView = () => (
    <ul>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId}>
          <input
            type="radio"
            onChange={this.onRadioButton}
            name="option"
            id={each.salaryRangeId}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobDetails()
  }

  render() {
    const {searchInput} = this.state

    return (
      <ul>
        <Header />
        <li>{this.renderProfileView()}</li>
        <hr />
        <div>
          <h1>Type of Employment</h1>
          {this.checkboxView()}
        </div>
        <hr />
        <div>
          <h1>Salary Range</h1>
          {this.radioView()}
        </div>
        <input
          type="search"
          value={searchInput}
          onChange={this.onSearchInput}
          placeholder="search"
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onSubmitSearch}
        >
          <BsSearch />
        </button>
        <li>{this.renderJobView()}</li>
      </ul>
    )
  }
}

export default AllJobs
