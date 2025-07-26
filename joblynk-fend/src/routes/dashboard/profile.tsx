import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faBuilding,
  faEdit,
  faEnvelope,
  faExclamationCircle,
  faFileAlt,
  faGlobe,
  faPhone,
  faSpinner,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { UserProfileEditModal } from '@/components/userProfileEditModal'
import { SeekerProfileEditModal } from '@/components/seekerProfileEditModel'
import { RecruiterProfileEditModal } from '@/components/recruiterProfileEditModal' // New import
import { getUserProfile, updateUserProfile } from '@/services/user'
import { updateSeekerEmployment, updateSeekerResume } from '@/services/seeker'
import { updateRecruiterCompany } from '@/services/recruiter' // New import
import { portPresignedURL, uploadFileToS3 } from '@/services/file'

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSeekerEditModalOpen, setIsSeekerEditModalOpen] = useState(false)
  const [isRecruiterEditModalOpen, setIsRecruiterEditModalOpen] =
    useState(false) // New state

  const {
    data,
    isLoading: isDataLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ['userDetails'],
    queryFn: () => getUserProfile(),
  })

  const {
    mutate: updateProfile,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
    reset: resetUpdateStatus,
  } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDetails'] })
      setIsEditModalOpen(false)
      resetUpdateStatus()
      toast.success('Profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const {
    mutate: updateSeekerDetails,
    isPending: isUpdatingSeeker,
    isError: isUpdateSeekerError,
    error: updateSeekerError,
    reset: resetUpdateSeekerStatus,
  } = useMutation({
    mutationFn: async ({
      employmentStatus,
      resumeFile,
    }: {
      employmentStatus: string
      resumeFile: File | null
    }) => {
      await updateSeekerEmployment(employmentStatus)

      if (resumeFile) {
        const presignedRes = await portPresignedURL(resumeFile)
        const { url, fields, key } = presignedRes.data

        const formData = new FormData()
        Object.entries(fields).forEach(([k, v]) =>
          formData.append(k, v as string),
        )
        formData.append('Content-Type', resumeFile.type)
        formData.append('file', resumeFile)

        await uploadFileToS3(url, formData)
        await updateSeekerResume(key)
        return key
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDetails'] })
      setIsSeekerEditModalOpen(false)
      resetUpdateSeekerStatus()
      toast.success('Seeker profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update seeker profile')
    },
  })

  const {
    mutate: updateRecruiterDetails,
    isPending: isUpdatingRecruiter,
    isError: isUpdateRecruiterError,
    error: updateRecruiterError,
    reset: resetUpdateRecruiterStatus,
  } = useMutation({
    mutationFn: ({
      companyName,
      companyWebsite,
    }: {
      companyName: string
      companyWebsite: string
    }) => updateRecruiterCompany(companyName, companyWebsite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDetails'] })
      setIsRecruiterEditModalOpen(false)
      resetUpdateRecruiterStatus()
      toast.success('Recruiter profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update recruiter profile')
    },
  })

  const handleSaveProfile = async (updatedData: {
    firstName: string
    lastName: string
    email: string
    phone: string | null
  }) => {
    updateProfile(updatedData)
  }

  const handleSaveSeekerProfile = async (updatedData: {
    employmentStatus: string
    resumeFile: File | null
  }) => {
    updateSeekerDetails(updatedData)
  }

  const handleSaveRecruiterProfile = async (updatedData: {
    companyName: string
    companyWebsite: string
  }) => {
    updateRecruiterDetails(updatedData)
  }

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

  const userProfile = data?.data

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
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center justify-start">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
            Personal Information
          </h3>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center text-lg"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit
          </button>
        </div>
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
      {user.role === 'recruiter' && recruiter && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center justify-start">
              <FontAwesomeIcon
                icon={faBuilding}
                className="mr-2 text-gray-500"
              />
              Recruiter Details
            </h3>
            <button
              onClick={() => setIsRecruiterEditModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center text-lg"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit
            </button>
          </div>
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
      {user.role === 'seeker' && seeker && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center justify-start">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="mr-2 text-gray-500"
              />
              Seeker Details
            </h3>
            <button
              onClick={() => setIsSeekerEditModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center text-lg"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit
            </button>
          </div>
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

      <UserProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          resetUpdateStatus()
        }}
        initialData={{
          firstName: userProfile.user.firstName,
          lastName: userProfile.user.lastName,
          email: userProfile.user.email,
          phone: userProfile.user.phone,
        }}
        onSave={handleSaveProfile}
        isLoading={isUpdating}
        error={
          isUpdateError ? updateError.message || 'Failed to update.' : null
        }
      />

      {user.role === 'seeker' && seeker && (
        <SeekerProfileEditModal
          isOpen={isSeekerEditModalOpen}
          onClose={() => {
            setIsSeekerEditModalOpen(false)
            resetUpdateSeekerStatus()
          }}
          initialData={{
            employmentStatus: seeker.employmentStatus || 'unemployed',
            resumeUrl: seeker.resumeUrl || null,
          }}
          onSave={handleSaveSeekerProfile}
          isLoading={isUpdatingSeeker}
          error={
            isUpdateSeekerError
              ? updateSeekerError.message || 'Failed to update.'
              : null
          }
        />
      )}

      {user.role === 'recruiter' && recruiter && (
        <RecruiterProfileEditModal
          isOpen={isRecruiterEditModalOpen}
          onClose={() => {
            setIsRecruiterEditModalOpen(false)
            resetUpdateRecruiterStatus()
          }}
          initialData={{
            companyName: recruiter.companyName || null,
            companyWebsite: recruiter.companyUrl || null,
          }}
          onSave={handleSaveRecruiterProfile}
          isLoading={isUpdatingRecruiter}
          error={
            isUpdateRecruiterError
              ? updateRecruiterError.message || 'Failed to update.'
              : null
          }
        />
      )}
    </div>
  )
}
