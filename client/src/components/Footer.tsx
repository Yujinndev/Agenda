import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="py-12 mt-20 border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-6 xl:px-0 flex flex-col lg:flex-row justify-between">
        <Link
          to="/#home"
          className="flex items-center justify-center space-x-2"
        >
          <span className="brand text-2xl font-bold text-primary dark:text-white">
            Agenda
          </span>
        </Link>

        <div className="text-end flex flex-col">
          <span className="text-sm tracking-wide text-gray-600">
            Copyright © SynchroFission 2024 - Present | All rights reserved
          </span>
          <span className="text-sm tracking-wide text-gray-400">
            Developed by:&nbsp;
            <a
              target="_blank"
              href="https://www.facebook.com/yujinwho/"
              className="underline underline-offset-4"
            >
              Mark Eugene Laysa
            </a>
            &nbsp;&&nbsp;
            <a
              target="_blank"
              href="https://www.facebook.com/maggoat29"
              className="underline underline-offset-4"
            >
              Jerick Gaerlan
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
