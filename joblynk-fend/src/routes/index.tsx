import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-full bg-gray-100">
      {/* Image Section (2/3) */}
      <div
        className="w-3/5 bg-cover bg-center"
        style={{ backgroundImage: `url('/job-background.jpg')` }}
      ></div>

      {/* Hero Text and Search Section (1/3) */}
      <div className="flex flex-col justify-center items-center w-2/5 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your <span className="text-blue-600">Dream Job</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Connecting talent with opportunity.
        </p>
        <div className="w-full">
          <div className="flex items-center justify-center mb-4">
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="p-3 border border-gray-300 rounded-l-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
            <input
              type="text"
              placeholder="Location"
              className="p-3 border border-gray-300 border-l-0 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Search
          </button>
          <div className="flex justify-center mt-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Or Hire Employees
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
