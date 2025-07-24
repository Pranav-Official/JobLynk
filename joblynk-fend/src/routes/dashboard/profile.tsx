import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faBuilding,
  faEnvelope,
  faExclamationCircle,
  faFileAlt,
  faGlobe,
  faPhone,
  faSpinner,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { getUserProfile } from '@/services/user' // Assuming this path is correct

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    data,
    isLoading: isDataLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ['userDetails'],
    queryFn: () => getUserProfile(),
  })

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="2xl"
          className="text-blue-500 mb-4"
        />
        <p className="text-lg text-gray-600">Loading profile data...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-red-600">
        <FontAwesomeIcon
          icon={faExclamationCircle}
          size="2xl"
          className="mb-4"
        />
        <p className="text-lg">Error loading profile:</p>
        <p className="text-md text-center">
          {fetchError.message || 'An unknown error occurred.'}
        </p>
      </div>
    )
  }

  const userProfile = data?.data // Accessing the data field from ApiResponse

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-gray-600">
        <p className="text-lg">No profile data available.</p>
      </div>
    )
  }

  const { user, recruiter, seeker } = userProfile

  return (
    <div className="p-8 w-full bg-white shadow-lg rounded-lg mx-auto">
      <div className="mb-8 border-b pb-4 flex justify-start items-center">
        {/* Adjusted: Header content to be left-aligned */}
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-start">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-600" />
            User Profile
          </h2>
          <p className="text-gray-600 mt-2">
            View and manage your personal and professional details.
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-start">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
            <FontAwesomeIcon icon={faPhone} className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-medium text-gray-900">
                {user.phone || 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="text-blue-500 mr-3"
            />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium text-gray-900">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Information */}
      {user.role === 'recruiter' && recruiter && (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-start">
            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-500" />
            Recruiter Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-green-500 mr-3"
              />
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {recruiter.companyName || 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
              <FontAwesomeIcon icon={faGlobe} className="text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Company Website</p>
                <p className="text-lg font-medium text-gray-900">
                  {recruiter.companyUrl ? (
                    <a
                      href={recruiter.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {recruiter.companyUrl}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Seeker Information */}
      {user.role === 'seeker' && seeker && (
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-start">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="mr-2 text-gray-500"
            />
            Seeker Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="text-purple-500 mr-3"
              />
              <div>
                <p className="text-sm text-gray-500">Employment Status</p>
                <p className="text-lg font-medium text-gray-900">
                  {seeker.employmentStatus || 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-start text-left">
              <FontAwesomeIcon
                icon={faFileAlt}
                className="text-purple-500 mr-3"
              />
              <div>
                <p className="text-sm text-gray-500">Resume</p>
                <p className="text-lg font-medium text-gray-900">
                  {seeker.resumeUrl ? (
                    <a
                      href={seeker.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
