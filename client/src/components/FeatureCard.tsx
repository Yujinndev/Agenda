import { ReactNode } from 'react'

interface CardProps {
  icon: ReactNode
  name: string
  desc: string
}

const FeatureCard = ({ icon, name, desc }: CardProps) => {
  return (
    <div className="flex flex-col gap-6 rounded-2xl p-8 transition duration-300 hover:bg-white hover:shadow-2xl hover:shadow-gray-600/10 dark:hover:bg-gray-700/60 dark:hover:shadow-none">
      <div className="flex h-10 w-10 rounded border border-gray-200 dark:border-gray-700">
        <div className="m-auto grid h-6 w-6 place-items-center text-gray-700 dark:text-white">
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-center text-xl font-semibold text-gray-900 dark:text-white">
          {name}
        </h2>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          {desc}
        </p>
      </div>
    </div>
  )
}

export default FeatureCard
