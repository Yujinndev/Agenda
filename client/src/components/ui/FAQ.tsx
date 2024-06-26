import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { MouseEventHandler } from 'react'

interface FAQProps {
  question: string
  answer: string
  isActive: boolean
  toggleAccordion: MouseEventHandler
}

function FAQ({ question, answer, isActive, toggleAccordion }: FAQProps) {
  return (
    <div className="faq mx-auto max-w-2xl">
      <div className="text-lg">
        <button
          type="button"
          className="flex w-full items-start justify-between py-6 text-left text-gray-400"
          onClick={toggleAccordion}
          aria-expanded={isActive ? 'true' : 'false'}
        >
          <span className="font-medium text-gray-900 dark:text-white">
            {question}
          </span>
          <span className="ml-6 flex h-7 items-center">
            <svg
              className={cn('arrow-down h-6 w-6 transform duration-300', {
                'rotate-180': isActive,
              })}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      {isActive && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -10, maxHeight: 0 },
            visible: { opacity: 1, y: 0, maxHeight: '100%' },
          }}
          initial="hidden"
          animate="visible"
          transition={{ type: 'spring', stiffness: 50 }}
          className="blockl transform overflow-hidden pr-12 duration-300"
        >
          <div className="pb-4 text-base text-gray-600 dark:text-gray-400">
            {answer}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FAQ
