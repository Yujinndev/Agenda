import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="py-12 mt-20 border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-6 xl:px-0 flex justify-between">
        <Link
          to="/#home"
          className="flex items-center justify-center space-x-2"
        >
          <span className="brand text-2xl font-bold text-primary dark:text-white">
            Agenda
          </span>
        </Link>

        <div className="text-center">
          <span className="text-sm tracking-wide text-gray-500">
            Copyright © SynchroFission 2023 - Present | All rights reserved
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
