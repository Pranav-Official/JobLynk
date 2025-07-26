import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext } from 'react'
import {
  faBriefcase,
  faRocket,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OnboardingNavigationContext } from './route'
import { useOnboardingStore } from '@/stores/onboardingStore'

export const Route = createFileRoute('/onboarding/exit')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const navContext = useContext(OnboardingNavigationContext)
  const { currentRole } = useOnboardingStore()

  const handleLetsGo = () => {
    if (currentRole === 'seeker') {
      navigate({ to: '/jobs' })
    } else if (currentRole === 'recruiter') {
      navigate({ to: '/dashboard' })
    }
  }

  const getContent = () => {
    if (currentRole === 'seeker') {
      return {
        icon: faBriefcase,
        title: "Let's start applying for jobs!",
        subtitle: 'Your profile is ready. Time to find your dream job.',
        description:
          'Browse through thousands of job opportunities tailored to your skills and preferences.',
        buttonText: "Let's Go",
      }
    } else if (currentRole === 'recruiter') {
      return {
        icon: faUserTie,
        title: 'Head to dashboard to start recruiting!',
        subtitle: 'Your company profile is set up. Time to find great talent.',
        description:
          'Post job openings, review applications, and connect with qualified candidates.',
        buttonText: "Let's Go",
      }
    } else {
      return {
        icon: faRocket,
        title: 'Welcome aboard!',
        subtitle: 'Your profile is ready.',
        description: 'Get started with your journey.',
        buttonText: "Let's Go",
      }
    }
  }

  const content = getContent()

  return (
    <>
      <div className="p-8 max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <FontAwesomeIcon
              icon={content.icon}
              className="text-4xl text-blue-600"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">{content.subtitle}</p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="mt-12">
          <button
            onClick={handleLetsGo}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faRocket} className="mr-3" />
            {content.buttonText}
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          You can always update your profile settings later from your dashboard.
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
        <button
          disabled={navContext?.currentStep.hidePrevious}
          onClick={navContext?.handlePrevStep}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            navContext?.currentStep.hidePrevious
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>

        <div className="text-sm text-gray-500">Onboarding Complete</div>
      </div>
    </>
  )
}
