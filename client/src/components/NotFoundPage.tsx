import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-semibold text-red-500">404</h1>
        <p className="mb-4 text-2xl text-gray-600">
          Oops! Looks like you're lost.
        </p>
        <span className="w-[25%] m-auto text-lg">
          The link may be broken, or the page may have been removed. <br />
          Check to see if the link you're trying to open is correct.
        </span>
        <div className="animate-bounce pt-24">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>
        <p className="mt-4 text-lg text-gray-600">
          Let's get you back{' '}
          <Link to="/" className="text-blue-500">
            home
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage
